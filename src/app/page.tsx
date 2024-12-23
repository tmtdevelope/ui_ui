import { Box, Container } from "@mui/material";
import Image from "next/image";
export default function Home() {
    return (
/*         <Container sx={{ bgcolor: '#e8eaf6', width: '100%',fluid }}>
 */          <Box
            sx={{
                bgcolor: '#e8eaf6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                width: '100vw', // Full viewport width
                margin: 0
            }}
        >
            {/* Your content here */}

            <h1>Welcome Quest</h1>
        </Box >
        // </Container>
    );
}
