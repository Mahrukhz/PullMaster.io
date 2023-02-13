import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PullRequestItem } from "./PullRequestItem";
function App() {
    const [pullRequests, setPullRequests] = useState([]);

    useEffect(() => {
        getPullRequests();
    }, []);

    const getPullRequests = async () => {
        const res = await axios.get("http://localhost:8000/pullrequests/history/2");
        console.log(res.data);
        setPullRequests(res.data);
    };
    

    

    return (
        <div className="App">
            <h1>History</h1>
            <div>
                {pullRequests.map((pullRequest) => {
                    return (
                        <PullRequestItem key={pullRequest._id} pullRequest={pullRequest}/>
                        // <h1>Hi</h1>
                    )})}
            </div>
        </div>
    );
}

export default App;
