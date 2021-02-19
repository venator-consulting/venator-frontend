import React from 'react'
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const LoginBox = () => {

    return (
        <Box >
            <Typography variant="body2" color="textSecondary" align="center" style={{ textAlign: "center", marginTop: "100px" }}>
                {"Copyright © "}
                <a style={{ color: "#1E90FF" }} target="_blank" color="inherit" href="http://www.venator-consulting.de/">
                    Venator-Consulting
            </a>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
        </Box>
    )
}

export default LoginBox
