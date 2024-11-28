import TradeHistory from "@/components/defi/trade-history";
import TradeMapping from "@/components/defi/charts/trade-mapping";
import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Box } from "@mui/material";

export default function DefiMarket() {
    return (
        <Layout>
            <Seo title="DeFi Market" />
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Box>
                    <h1>DeFi Market</h1>
                    <TradeMapping />
                    <TradeHistory />
                </Box>
            </Box>
        </Layout>
    )
}