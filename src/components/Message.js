import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Message() {

    const [data, setData] = useState({ msg: '', recipient: '', isSent: false });
    const [messages, setMessages] = useState([]);
    useEffect(()=>{
        getMsgs(); 
    }, [])

    const onChange = (event) => {
        const { target } = event;
        const { name, value } = target;
        const newData = {
            ...data,
            [name]: value
        };
        setData(newData)
    };

    const sendMsg = async () => {
        await axios.post('http://localhost:8080/api/msg', {
            ...data
        })

        setData({...data, isSent: true});
        setTimeout(()=>{setData({...data, isSent: false});}, 5000 )
        getMsgs();  
    };

    const getMsgs = async() =>{
        const {data} = await axios.get('http://localhost:8080/api/msgs');
        console.log(data.messages)
        setMessages(data.messages.map((msg)=> <div class="bubble"><p>SMS: {msg.msg}</p><p>To: {msg.recipient}</p></div> ))
    };

    return (
        <div className="message">
            <h1>TWILIO SMS APP</h1><br />
            {data.isSent && <Alert id="alert" severity="success">El SMS fue enviado!</Alert> }
            <TextField name="recipient" value={data.recipient} onChange={onChange} id="outlined-basic" label="+57 315XXXXXXX" variant="outlined" /><br /><br />
            <TextField name="msg" value={data.msg} onChange={onChange} id="outlined-basic" label="Escribe tu mensaje..." variant="outlined" multiline rows={5} /><br /><br />
            <Button onClick={sendMsg} variant="contained">Enviar SMS</Button><br /><br />
            <h3>SMS Enviados</h3>
            {messages.length>0 ? messages : <p>No has enviado SMS aún</p>}
        </div>
    );
}

export default Message;
