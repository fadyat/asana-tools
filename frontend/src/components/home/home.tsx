import {getMeLocalStorage} from "../../storage/me";
import React from "react";
import {Card, CardContent, Typography} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';

const RenderImage = ({imagePath, name = "stranger"}: { imagePath: string, name?: string }) => {
    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "none",
            }}
        >
            <CardContent>
                <Typography variant='h3'>
                    Hello, {name}
                </Typography>
            </CardContent>
            <CardMedia image={imagePath}
                       component="img"
                       sx={{width: "30%"}}
                       title="Hello"
            />
        </Card>
    )
}

const Home: React.FC = React.memo(() => {
    const me = getMeLocalStorage()

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
        }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10%"
                }}
            >
                {
                    me ? <RenderImage imagePath={'/hello.webp'} name={me.name}/>
                        : <RenderImage imagePath={'/login.webp'}/>
                }
            </div>
        </div>
    );
});

export default Home;