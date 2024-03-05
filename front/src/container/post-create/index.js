import './index.css';
import Grid from '../../component/grid';

import FieldForm from '../../component/field-form';
import { useState } from 'react';

import { Alert, Loader, LOAD_STATUS } from '../../component/load';

export default function Container({ onCreate, placeholder, button, id = null }) {
    const [status, setStatus] = useState(null)
    const [message, setMessage] = useState('')

    const convertData = ({ value }) =>
        JSON.stringify({
            text: value,
            username: 'user',
            postId: id,
        });

    const sendData = async (dataToSend) => {
        setStatus(LOAD_STATUS.PROGRESS);

        try {
            const res = await fetch("http://localhost:4000/post-create", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: convertData(dataToSend),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus(null)
                if (onCreate) onCreate();
            } else {
                setMessage(data.message);
                setStatus(LOAD_STATUS.ERROR);
            }



        } catch (error) {
            setMessage(error.message)
            setStatus(LOAD_STATUS.ERROR)
        }


    };

    const handleSubmit = (value) => {
        return sendData({ value });
    };

    return (
        <Grid>
            <FieldForm
                placeholder={placeholder}
                button={button}
                onSubmit={handleSubmit}
            ></FieldForm>


            {
                status === LOAD_STATUS.ERROR && (
                    <Alert status={status} message={message} />
                )}

            {status === LOAD_STATUS.PROGRESS && <Loader />}


        </Grid>
    )
}