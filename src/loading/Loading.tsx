import React from "react";

export default function Loading(props: any) {
    return (
        <div className='loading'>
            <p>Loading{props.text ? props.text : ''}</p>
        </div>
    )
}