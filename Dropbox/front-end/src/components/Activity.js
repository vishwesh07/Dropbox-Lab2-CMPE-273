import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as API_Activity from "../api/API_Activity";
import * as API_IsSignedIn from "../api/API_IsSignedIn";

class Activity extends Component{

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            username: this.props.username,
            user_activity: []
        };
    }

    componentWillMount(){

        console.log("In IsSignedIn request of willMount");

        API_IsSignedIn.checkIsSignedIn()
            .then((status) => {

                    if(status === 200){
                        console.log("User is authorized to access this page");
                    }
                    else{
                        this.props.history.push("/SignIn");
                    }

                }
            );

        API_Activity.getUserActivity()
            .then((data) => {
                console.log(data);
                this.setState({
                    ...this.state,
                    user_activity: data.activityArr
                });
            });

    }

    componentDidMount(){

        API_Activity.getUserActivity()
            .then((data) => {
                console.log(data);
                this.setState({
                    ...this.state,
                    user_activity: data.activityArr
                });
        });

    }

    pushTo = (page) => {

        console.log("In pushTo "+ page);
        switch(page) {
            case "Home":
                console.log(page);
                this.props.history.push("/HomePage");
                break;
            case "Files":
                console.log(page);
                this.props.history.push("/Files");
                break;
            case "Groups":
                console.log(page);
                this.props.history.push("/Groups");
                break;
            case "Activity":
                console.log(page);
                this.props.history.push("/Activity");
                break;
            case "Profile":
                console.log(page);
                this.props.history.push("/Profile");
                break;
            default:
        }
    };


    render(){
        return (

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3 col-md-2 sidebar">

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <input
                            type="button"
                            value="Sign Out"
                            className="btn btn-primary"
                            onClick={this.props.handleSignOut}
                        />

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <div className="upload-btn-wrapper">
                            <button className="btn">Upload a file</button>
                            <input className={'fileupload'} type="file" name="myfile" onChange={this.handleFileUpload}/>
                        </div>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <button className="btn" onClick={() => this.pushTo("Home")}>Home</button>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <button className="btn" onClick={() => this.pushTo("Files")}>Files</button>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <button className="btn" onClick={() => this.pushTo("Groups")}>Groups</button>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <button className="btn" onClick={() => this.pushTo("Activity")}>Activity</button>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                        <button className="btn" onClick={() => this.pushTo("Profile")}>Profile</button>

                        <hr style={{height:'10px', border: '0',boxShadow: '0 10px 10px -10px #8c8b8b inset',}}/>

                    </div>

                    <div className="col-sm-9 col-md-10 main">

                        <h1 className="page-header">

                            Welcome

                            <br/> {this.props.username}

                        </h1>

                        <br/> <br/>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th style={{textAlign: 'center'}}>ActivityName</th>
                                    <th style={{textAlign: 'center'}}>Document</th>
                                    <th style={{textAlign: 'center'}}>TimeStamp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.user_activity && (this.state.user_activity.map(activity => (
                                    <tr>
                                        <td>{activity.ActivityName}</td>
                                        <td>{activity.DocName}</td>
                                        <td>{activity.TimeStamp}</td>
                                    </tr>
                                )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default withRouter(Activity);