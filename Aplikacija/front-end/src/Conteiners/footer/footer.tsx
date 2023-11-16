import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";

export const Footer: FC = (): ReactElement => {
    return (
        <footer
            style={{
                width: "100%",
                backgroundColor: "#1f2833",
                paddingTop: "12px",
                paddingBottom: "12px",
                marginTop: "auto",
            }}
        >
            <Container maxWidth="lg">
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={12}>
                        <Typography color="white" variant="h6">
                            NisNocu
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="white" fontSize="14px">
                            NisNocu © 2023
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </footer>
    );
};

export default Footer;