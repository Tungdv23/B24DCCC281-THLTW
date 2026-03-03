import { useState } from "react";
import { Button, Input, message } from "antd";

const TroChoi = () => {
    const [randomNumber, setRandomNumber] = useState(
        Math.floor(Math.random() * 100) + 1
    );
    const [doan, setDoan] = useState("");
    const [luot, setLuot] = useState(10);
    const [gameOver, setGameOver] = useState(false);
    const [res, setRes] = useState("");
    const handleGuess = () => {
        if (gameOver) return;
        const number = parseInt(doan); 
        if (isNaN(number) || number < 1 || number > 100) {
            message.error("chọn 1 số từ 1 -> 100");
            return;
        }
        if (number === randomNumber) {
            setRes("Đoán đúng rồi yeahhhh");
            setGameOver(true);
            return;
        }
        if (luot - 1 === 0) {
            setRes(`Hết lượt! Số đúng là ${randomNumber}`);
            setLuot(0);
            setGameOver(true);
            return;
        }
        if (number < randomNumber) {
            setRes("Thấp quá");
        } else {
            setRes("Cao quá");
        }
        setLuot(luot - 1);
        setDoan("");
    };
    const choiLai = () => {
        setRandomNumber(Math.floor(Math.random() * 100) + 1);
        setLuot(10);
        setGameOver(false);
        setRes("");
        setDoan("");
    };
    return (
        <div style={{ maxWidth: 400 }}>
            <h1>vua trò chơi</h1>
            <p>Bạn có {luot} lượt đoán</p>

            <Input
                placeholder="Nhập số từ 1 đến 100" value={doan} onChange={(e) => setDoan(e.target.value)} disabled={gameOver}
            />
            <div style={{ marginTop: 10 }}>
                <Button type="primary" onClick={handleGuess} disabled={gameOver}>Đoán</Button>
                <Button style={{ marginLeft: 10 }} onClick={choiLai}> Chơi lại</Button>
            </div>
            <p>{res}</p>
        </div>
    );
};

export default TroChoi;