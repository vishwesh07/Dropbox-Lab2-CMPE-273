import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
import * as API_GetDocs from "../api/API_GetDocs";
import SignOut from "./SignOut";
import CreateFolder from "./CreateFolder";
import UploadFile from "./UploadFile";

class HomePage extends Component{

    constructor(props){
        super(props);
        this.state = {
            userdata: {
                email : this.props.email,
                username: this.props.username,
                userdata: this.props.userdata
            },
            message: this.props.homePageMessage,
            foldername: this.props.foldername,
            currentPath: this.props.currentPath
        };
        this.st = {currentPath: './public/upload/'+ this.props.email +'/'};
    }

    componentWillMount(){
        if(this.props.username === undefined){
            this.props.history.push("/");
        }
    }

    componentDidMount(){
        API_GetDocs.getDocs()
            .then((data) => {
                this.setState({
                    ...this.state,
                    userdata: data
                });
            });
    }

    getFolderName = (event) => {
        console.log("In get Folder name");
        this.setState({
            ...this.state,
            foldername: event.target.value
        });
    };

    render() {

        console.log("In RENDER HomePage");

        return (

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3 col-md-2 sidebar">

                        <br/> <br/>

                        <SignOut handleSignOut={this.props.handleSignOut}/>

                        <br/> <br/>

                        {this.state.message}

                        <CreateFolder getFolderName={this.getFolderName}/>

                        <br/> <br/>

                        <UploadFile handleFileUpload={this.props.handleFileUpload}/>

                        <br/> <br/>

                        <a href={'Activity.js'}> Activity </a>

                    </div>

                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                        <h1 className="page-header">
                            <br/> <br/>

                            Welcome

                            <br/> {this.props.username}

                        </h1>

                        <br/> <br/>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th style={{textAlign: 'center'}}>Favorite</th>
                                    <th style={{textAlign: 'center'}}>DocName</th>
                                    <th style={{textAlign: 'center'}}>Owner</th>
                                    <th style={{textAlign: 'center'}}>DocPath</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    {this.props.displayBackButton}
                                    <td></td>
                                </tr>
                                {this.state.user_docs && (this.state.user_docs.map(doc => (
                                    <tr>
                                        <td>{this.props.displayStar(doc)}</td>
                                        <td>{this.props.displayDocument(doc)}</td>
                                        <td>{this.props.username}</td>
                                        <td>{doc.DocPath}</td>
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

export default withRouter(HomePage);
