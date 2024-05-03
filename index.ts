import { CohereClient } from "cohere-ai";
import TelegramBot from "node-telegram-bot-api";

const cohere = new CohereClient({
    token: process.env.API_TOKEN || "",
});

export default async function chat(chatId: number, bot: TelegramBot, text: string): Promise<void> {
    const chat = await cohere.chat({
        model: "command-r-plus",
        message: text,
        documents: [
            {
             "identity": "Your name is Jupiter AI bot, you are built by FX and a one stop shop for all things Jupiter Ag on Solana"
            },
            {
                "title": "Solana Resources",
                "text": `1. Sherlock
    
                You can use Sherlock to access a “view-only” version of users’ accounts. Use Sherlock to view Jupiter/Meteora as if you are the user himself. You can’t make transactions, but you can view what’s going on.
                
                [Sherlock Wallet](https://chromewebstore.google.com/detail/sherlock-wallet/fnkhhpcgjmehogcdgjihbfbbgcfmogmd?hl=en-GB)
                
            2. SolanaFM & Solscan
                
                Solana explorers suck ass. Use 2 explorers at once (i use FM and Solscan) to make sure you dont miss anything. The “Sol Balance Change” and “Token Balance Change” are the two important things. 
                
            3. Check tokens danger here
            
            [RugCheck - Solana token checker](https://rugcheck.xyz/tokens/7gFeLbzkkgSm7t97Jm4cbnXnHNULNF3VEpehFc6jTPwL)
            
            1. For checking addresses on OpenBook:
                
                Openserum or SolanaFM
                
            2. Eject by Solworkz`},
            {
                "title": "Perps",
                "text": `### Pyth Oracles

                - UI uses Pythnet WSS, to draw the chart/line.
                - Keeper and other transactions use Pyth mainnet oracle.
                - If pyth mainnet oracles becomes stale during volatility, Keepers will use Pythnet oracle
                    - Pythnet oracle in this context → another Jupiter keeper writes the pythnet price to mainnet every 1s.
                    - Similar to how congestion affects the pyth mainnet oracle, congestion also makes it harder to write the pythnet price to mainnet.
                    - However, the fallback Pyth Pull oracle has improved reliability in volatility
                
                To check for exact Solana mainnet Pyth push price: https://pyth.network/price-feeds/crypto-sol-usd?cluster=solana-mainnet-beta&range=1H
                
                ### UI Freezing
                
                - Some statistics pull from Birdeye API, and if its down it will stop working
                    
                    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/31106ea6-b25c-4fc0-ad27-f70cdc350df6/f078fe29-9e31-4bb5-b08a-f8ef48a8cd4d/Untitled.png)
                    
                - UI relies on oracles to update, if the oracle is stale the UI will also freeze. Now, thanks to the Pyth Pull oracle it is more reliable, however not perfect.
                - Next step → move to browser simulation, improve UI speed + remove reliance on oracles
                
                ### JLP FAQ
                
                1. Why can’t I deposit JLP?
                    
                    Caps are raised slowly over-time. We raise caps slowly as we grow the platform and battle-test the code. 
                    
                2. What is JLP for?
                    
                    JLP is a liquidity token for the Jupiter Perps platform. You can buy and sell JLP on AMMs, or deposit liquidity directly to JLP and mint additional JLP tokens. You get an APR for depositing into it and can be viewed on the Jupiter Perps Earn page. 
                    
                    Users trade against the JLP token, and pay fees for an APR.
                    
                3. How often is APY calculated or distributed?
                    
                    Weekly. Your yield is distributed immediately whenever a user makes a trade. 
                    
                4. What is the value of JLP?
                    
                    The value of JLP is affected by the price of the underlying assets in the basket, the fees collected from trading activity, and the P&L of the traders.
                    
                5. Why is the TVL less than the sum of every pool?
                    
                    The sum of every pool includes traders collateral, while the TVL only contains JLP liquidity. 
                    
                
                ### Trading FAQ
                
                1. What are the fees for Perpetual?
                    1. 0.1% fee for takers. There is 0% slippage. 70% of the taker fees goes to JLP holders.
                2. In what scenarios would a position close?
                    
                    Typically, when a position is closed, it's either due to Liquidation, TP/SL being triggered, or a manual Market Close by the user.
                    
                    Users are able to close their positions at **any** time. 
                    
                3. What do the different Order Types mean?
                    
                    Market = Open or close a position, Trigger = TP or SL, Liquidation = liquidation, Limit Order (in the future) = open or close a position
                    
                4. Why are there only 3 markets for Perpetual?
                    
                    Introducing new markets require high spot liquidity, and adding the token into JLP. This is a slightly longer process and will take some time. 
                    
                5. Why do I receive in my longed token instead of what I bought it with
                    
                    When you long a token, you're buying the token and using it as collateral. Thus your collateral will be returned in the form of the longed token.
                    
                    When shorting, you get back USDC or USDT, based on the utilization of each asset. 
                    
                6. Who is the signer address when you click to view the txn details of a perpetual trade history?
                    - Example: A2rCQdCqQB4wu72x9Q7iq1QugtdZmcyWsiSPfgfZzu2u —> Keeper 1?
                    - Example: DFZcDnmEYNUK1khquZzx5dQYiEyjJ3N5STqaDVLZ88ZU —> Keeper 2?
                7. Why are positions combined? How is the size and leverage calculated on the UI when the position is combined?
                    - The leverage is just the average of the leverage level of each time you create a position. e.g. 1.2x + 1.4x = 1.3x
                    - Size = initial collateral multiplied by the leverage level.
                
                ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/31106ea6-b25c-4fc0-ad27-f70cdc350df6/05d2f0aa-1e22-4efc-8415-5996db1e53b1/Untitled.png)
                
                1. When positions are combined, does the TP/SL also stay the same?
                    
                    Yes
                    
                2. How is the $PNL calculated (the $PNL shown on trade history)?
                    
                    Shorts → (Entry Price - Market Price) * size. 
                    
                    Longs → (Market Price - Entry Price) * Size
                    
                3. Is the $PNL shown on trading history pre-fees or Net value (after fees)?
                    - Pre-fees
                4. From user: the "locked assets" on the "earn" page add up to a lot more than the number stated. The numbers add up to almost $2 per JLP, but it says the price is $1.74. ($1.83 on the market) Am I misunderstanding something here? Or is this something that the market should arbitrage? If it is, maybe the actual value of those assets should be more clear.
                    
                    TVL represents the funds users deposited into the JLP pool, and the pool size based on LP + collateral from traders for their leverage (when they open their long or short position).
                    If average leverage is 10x, you should see about 10% more if the pool is fully utilized, 5% more if 50% utilized.
                    
                    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/31106ea6-b25c-4fc0-ad27-f70cdc350df6/6ca3e7c3-0b3b-405a-a939-a452c15cd23e/Untitled.png)
                    
                
                ### Oracle Issues
                
                Oracle is required for any type of changes to a position. 
                
                Sometimes (especially during market volatility) the oracle will be stale, and users cant close, liquidate, add collateral or have TP/SL filled.
                
                - Even though oracle is stale, users can still submit attempts to add collateral/ close positions. These attempts will not be affected by oracle.
                
                ### Troubleshooting
                
                1. Insufficient Liquidity / Limited liquidity
                    
                    Jupiter Perps relies on JLP liquidity to allow users to open & close positions. Caps are raised regularly and TVL is growing, and overtime you can trade in larger sizes. 
                    
                2. Wrongful Liquidation
                    
                    There has been 0 cases of wrongful liquidations. Ping Soju to investigate further. 
                    
                3. When I was trying to open a position, I received an AUM cap limit notification. Even for small trades of a few hundred dollars with low leverage (3-5x). Is there a way I can increase my AUM cap?
                    
                    When entering a position, whether Long or Short, it hinges on the available liquidity within the JLP pool.
                    
                    - Long Positions: For SOL, ETH, WBTC, it relies on the availability of the respective assets within the JLP pool.
                    - Short Positions: In the case of SOL, ETH, WBTC, it depends on the availability of stablecoin assets, specifically USDC and USDT.
                4. Why can’t they open a position? 
                    - JLP limit, price slippage, oracle issue etc.
                5. **Couldn’t add funds and transaction failed → got liquidated**
                    
                    To add collateral, you need the oracle to update the health of your position. Sometimes this oracle update fails and your transaction fails, sorry that this happened to you.
                    
                    We’re working on something that will help solve this and will keep you updated as it goes. 
                    
                    Ping Soju if he gets very angry → we process partial refunds for this. 
                    
                6. **Transaction failed (close, add, TP/SL, etc)**
                    
                    Usually the biggest reason is oracle staleness. We are implementing improvements to this that should help, but for now you can try again repeatedly and wait for the oracle to come online. 
                    
                7. **Refund/compensation related to Solana network being down:**
                    
                    Unfortunately, can’t refund if liquidations occurred when the network was down and there was no TP/SL set in advance.
                    
                    We can refund if the users set SL but they get liquidated instead. If they have TP but it should execute during the chain go down, we cant do anything about it, historical TPSL is not implemented and we are not refunding those.
                    
                    If the users is asking for refund about borrow fees, we are discussing something to compensate them, maybe opening fees or borrow fees during that period, but no promise.
                    
                    More info regarding SL:
                    
                    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/31106ea6-b25c-4fc0-ad27-f70cdc350df6/152f140f-4fb8-421d-b347-06c76a16712e/Untitled.png)
                    
                8. Why did my TP or SL not trigger
                    
                    It’s common for orders to wick the take-profit price and go back down, before being filled. There needs to be time for the keepers to react and close your position, and this applies to liquidations too. 
                    
                    We are working on some improvements to this as well, and will let you know soon. 
                    
                9. Trade not appearing in trade history or order history
                    
                    It takes time to appear, we can investigate whether the position was actually opened or not. This is similar to the next issue. 
                    
                10. Money deducted but i dont see my position.
                    
                    Jupiter Perps uses a 2 step process (CreateIncreasePositionRequest), and then (Increase Position) or (CloseRequest). The money gets deducted in the first step, but returned in the second step. Users frequently struggle with finding the second one. 
                    
                11. **I used the perpetual exchange and when i closed my position, i received usdt instead of sol even though i went in with sol**
                    
                    For long positions, the collateral is the token being longed *(e.g., SOL for SOL longs, BTC for BTC longs)*, while short positions are collateralized with supported stablecoins like USDC or USDT. 
                    
                    You can close a position by clicking on the "close" button in the position row.
                    
                    - **Long Positions:** Profits from long positions are disbursed in the asset you are longing. For instance, if you've gone long on SOL, your profits will be received in SOL.
                    - **Short Positions:** Profits from short positions are paid out in the same stablecoin used to open the position, such as USDC or USDT.
                    
                    For more information, please read: https://station.jup.ag/labs/perpetual-exchange/trading
                    
                12. **Why are we using Pyth? Any plans to change???** 
                    
                    Jupiter Perps relies on oracles. We are working on improving the stability and reliability of the oracle, stay tuned for more information. 
                    
                13. **When the solana network is down, what happens to my SL execution?**
                    
                    https://twitter.com/JupiterExchange/status/1754869966568902995
                    
                    Your stop loss will only be executed at the price if the oracle (Pyth) reports a price below (long) or above (short) the stop loss price when the chain continues.
                    
                    Jupiter Perpetual Exchange is an oracle based perpetual exchange. we refer our prices from the Pyth oracles.
                    
                    another thing to notice is that massive action won’t cause any big price changes on the Jupiter Perpetual Exchange prices, everything on the exchange has zero price impact and refers only to the oracles that aggregate prices from many reputable sources (Pyth).
                    
                    This is a feature we implemented to improve TP/SLs during sharp wicks and network unreliability, emphasizing fairness for traders.`},
            {
                "title": "Token Listing",
                "text": `**This should be deprecated ASAP, in favor for J.U.P’s token-list program.** 

                1) Project asks for advise to expedite listing
                
                 “there’s over 300 pull requests trying to get onto Jupiter’s strict list, the more you stand out the more likely you are to be added to the strict list”
                
                ---
                
                Here are the steps related to token listing:
                
                Q: How do I get my token onto Jupiter? ("All" list) https://station.jup.ag/docs/get-your-token-onto-jup
                
                - Your token must exist on-chain and have token metadata conforming to the Metaplex Token Metadata.
                - Your token must have at least $250 liquidity on both buy and sell sides.
                - The buy and sell price impact shouldn't be more than 30% as well. This is to prevent single-sided liquidity markets.
                - Once minimum liquidity is reached, we will automatically list the token within a couple of hours.
                
                Q: How do I get my token onto the Strict list?
                
                - Open a PR here: https://github.com/jup-ag/token-list
                - Please go through the README on the github repo carefully -- it contains everything you need to know with sample PRs and notes on how to engage the community.`}
        ]
    });


    
    await bot.sendMessage(chatId, chat.text)

};