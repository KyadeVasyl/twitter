import Title from '../../component/title';
import Grid from '../../component/grid';
import Box from '../../component/box';
import { Alert, LOAD_STATUS, Skeleton } from '../../component/load'
import PostCreate from '../post-create';
import { useState, Fragment } from 'react';
import { getDate } from '../../util/getDate';

import PostItem from '../post-item';

export default function Container() {

    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");

    const [data, setData] = useState(null);


    const convertData = (raw) => ({

        list: raw.list.reverse().map(({ id, username, text, date }) => ({
            id,
            username,
            text,
            date: getDate(date),
        })),
        isEmpty: raw.list.length === 0,
    })


    const getData = async () => {
        setStatus(LOAD_STATUS.PROGRESS);

        try {
            const res = await fetch("http://localhost:4000/post-list");

            const data = await res.json();

            if (res.ok) {
                setData(convertData(data))
                setStatus(LOAD_STATUS.SUCCESS)
            } else {
                setMessage(data.message);
                setStatus(LOAD_STATUS.ERROR);
            }



        } catch (error) {
            setMessage(error.message)
            setStatus(LOAD_STATUS.ERROR)
        }
    }


    if (status === null) getData();

    return (
        <Grid>
            <Box>
                <Grid>
                    <Title>Home</Title>
                    <PostCreate
                        onCreate={getData}
                        placeholder='What is happening'
                        button="Post"
                    />
                </Grid>
            </Box>

            {status === LOAD_STATUS.PROGRESS && (
                <Fragment>
                    <Box><Skeleton></Skeleton></Box>
                    <Box><Skeleton></Skeleton></Box>
                </Fragment>
            )}

            {status === LOAD_STATUS.ERROR && (
                <Alert status={status} message={message}></Alert>
            )}


            {status === LOAD_STATUS.SUCCESS && (
                <Fragment>
                    {data.isEmpty
                        ? (<Alert message={"Список постів пустий"}></Alert>)
                        : (
                            data.list.map((post) => (
                                <Fragment key={post.id}>
                                    <PostItem {...post} />

                                </Fragment>
                            ))
                        )}
                </Fragment>
            )}

        </Grid>
    )
}