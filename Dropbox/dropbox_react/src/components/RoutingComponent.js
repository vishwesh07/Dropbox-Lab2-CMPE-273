import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Homepage from "./HomePage";
import Files from "./Files";
import UploadFile from "./UploadFile";
import GetDocs from "./GetDocs";
import DeleteDocs from "./DeleteDocs";
import CreateFolder from "./CreateFolder";
import StarAction from "./StarAction";
import Profile from "./Profile";
import Activity from "./Activity";
import * as API_SignUp from '../api/API_SignUp';
import * as API_SignIn from '../api/API_SignIn';
import * as API_SignOut from "../api/API_SignOut";
import * as API_UploadFile from '../api/API_UploadFile';
import * as API_CreateFolder from '../api/API_CreateFolder';
import * as API_GetFiles from '../api/API_GetDocs';
import * as API_DeleteDoc from '../api/API_DeleteDocs';
import * as API_StarAction from '../api/API_StarAction';
import * as API_Activity from '../api/API_Activity';
import * as API_Profile from '../api/API_Profile';
import strImg from '../components/stared.jpg';
import unstrImg from '../components/unstared.png';
import file from '../components/file.png';
import folder from '../components/folder.png';
import {deleteFile} from "../api/API_DeleteDocs";


class RoutingComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            signInMessage: undefined,
            signUpMessage: undefined,
            email: undefined,
            username: undefined,
            user_docs: [],
            homePageMessage: undefined,
            foldername : undefined,
            currentPath : undefined
        };
        this.st = {currentPath: undefined};  //   './public/upload/'+ this.state.email +'/'
    }

    handleSignUp = (state) => {

        console.log("In handle SignUp, isSignedIn ="+this.state.isSignedIn)

        API_SignUp.doSignUp(state)
            .then( (response) => {

                if(response.status === 200){

                    this.setState({
                        ...this.state,
                        isSignedIn: true,
                        signUpMessage: undefined,
                        signInMessage: undefined,
                        email: response.email,
                        username: response.username,
                        currentPath: './public/upload/'+ response.email +'/'
                    });

                    this.st.currentPath = './public/upload/'+ response.email +'/';

                    console.log("In handle SignUp, status = "+ response.status+" isSignedIn = "+this.state.isSignedIn+" pushing to HomePage");

                    this.props.history.push("/HomePage");
                }

                else if(response.status === 401){

                    this.setState({
                        ...this.state,
                        isSignedIn: false,
                        signInMessage: undefined,
                        username: undefined,
                        email: undefined,
                        signUpMessage: 'User Already Exists'
                    });

                }

                else if(response.status === 303){

                    this.setState({
                        ...this.state,
                        isSignedIn: false,
                        signInMessage: undefined,
                        username: undefined,
                        email: undefined,
                        signUpMessage: '!! Required Fields are not filled !! '
                    });

                }

            });
    };

    handleSignIn = (state) => {

        console.log("In handle SignIn, isSignedIn ="+this.state.isSignedIn)

        API_SignIn.doSignIn(state)
            .then( (response) => {

                console.log("In response of Sign In : "+response.status);

                if(response.status === 200){

                    this.setState({
                        ...this.state,
                        isSignedIn: true,
                        signInMessage: undefined,
                        signUpMessage: undefined,
                        email: response.email,
                        username: response.username,
                        currentPath: './public/upload/'+ response.email +'/'
                    });

                    this.st.currentPath = './public/upload/'+ response.email +'/';

                    console.log("usernameSet : "+this.state.username);

                    this.props.history.push("/HomePage");
                }

                else if(response.status === 401){

                    this.setState({
                        ...this.state,
                        isSignedIn: false,
                        signUpMessage: undefined,
                        username: undefined,
                        email: undefined,
                        signInMessage: 'Invalid Username or Password'
                    });

                    console.log("In handle SignIn, status = "+ response.status+" isSignedIn = "+this.state.isSignedIn+" remaining in same page");

                }

                else if(response.status === 303){

                    this.setState({
                        ...this.state,
                        isSignedIn: false,
                        signUpMessage : undefined,
                        username: undefined,
                        email: undefined,
                        signInMessage: '!! Required Fields are not filled !! '
                    });

                }

            });
    };

    handleSignOut = () => {

        API_SignOut.doSignOut()
            .then( (response) => {

                if(response.status === 304){

                    this.setState({
                        ...this.state,
                        isSignedIn: false,
                        signInMessage: undefined,
                        signUpMessage: undefined,
                        email: undefined,
                        username: undefined,
                        currentPath: undefined
                    });

                    this.st.currentPath = undefined;


                    console.log("usernameUnSet : "+this.state.username);

                    this.props.history.push("/");
                }
            });
    };

    handleFileUpload = (event) => {

        const payload = new FormData();

        payload.append('myfile', event.target.files[0]);

        API_UploadFile.uploadFile(payload)
            .then((status) => {

                if (status === 204) {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            this.setState({
                                ...this.state,
                                user_docs: data,
                            });
                        });
                }

                else if(status === 304){
                    this.setState({
                        ...this.state,
                        homePageMessage: '!! Similar file already exists. !!'
                    });
                }

            });
    };

    handleFolderCreation = () => {

        this.st.foldername = this.state.foldername;

        console.log("In handleFolderCreation "+this.st.currentPath+" "+this.st.foldername);

        API_CreateFolder.createFolder(this.st)
            .then((status) => {

                if (status === 204) {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            this.setState({
                                ...this.state,
                                user_docs: data,
                                homePageMessage: ''
                            });
                        });
                }

                else if(status === 303){
                    this.setState({
                        ...this.state,
                        homePageMessage: '!! Required Fields are not filled !!'
                    });
                }

                else if(status === 304){
                    this.setState({
                        ...this.state,
                        homePageMessage: '!! Similar folder already exists. !!'
                    });
                }

            });
    };

    handleStarAction = (doc) => {
        API_StarAction.starAction(doc)
            .then(() => {
                API_GetFiles.getDocs(this.st)
                    .then((data) => {
                        console.log(data);
                        this.setState({
                            ...this.state,
                            user_docs: data
                        });
                    });
            });
    };

    handleDelete = (doc) => {

        if (doc.DocType === "folder") {

            API_DeleteDoc.deleteFolder(doc)
                .then((res) => {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            console.log(data);
                            this.setState({
                                ...this.state,
                                user_docs: data
                            });
                        });
                });
        }

        else if (doc.DocType === "file") {
            API_DeleteDoc.deleteFile(doc)
                .then((res) => {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            console.log(data);
                            this.setState({
                                ...this.state,
                                user_docs: data
                            });
                        });
                });
        }
    };

    navigateFolder = (event) => {
        console.log("In navigateFolder");

        console.log("In navigate :"+this.st.currentPath);

        let folder = event.target.value;
        let navigationPath = this.st.currentPath+folder +"/";
        this.st = {currentPath: navigationPath};
        console.log("New Path"+ navigationPath);
        console.log("In Navigate Folder "+this.st.currentPath);
        API_GetFiles.getDocs(this.st)
            .then((data) => {
                console.log(data);
                this.setState({
                    ...this.state,
                    user_docs: data
                });
            });
    };

    navigateBackFolder = (st) => {
        let folder = st.currentPath;
        let parentFolder = folder.substr(0, folder.lastIndexOf('/'));
        console.log(parentFolder);
        st.currentPath = parentFolder.substr(0, parentFolder.lastIndexOf('/')) + "/";
        console.log("In navigate back"+st.currentPath);
        API_GetFiles.getDocs(st)
            .then((data) => {
                console.log(data);
                this.setState({
                    ...this.state,
                    user_docs: data
                });
            });
    };

    displayStar = (doc) => {
        if(doc.Star === 0){
            return (<img src={unstrImg} height={'20px'} width={'20px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
        else{
            return (<img src={strImg} height={'20px'} width={'20px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
    };

    displayDocument = (doc) => {
        if(doc.DocType === "folder"){
            return (
                <div>
                    <td>
                        <img src={folder} height={'30px'} width={'30px'} alt={'Not available'}/>
                    </td>
                    <td>
                        <button type="button" className="btn btn-link" onClick = {(event) => this.navigateFolder(event)} value={doc.DocName} > {doc.DocName} </button>
                    </td>
                    <td>
                        <img src={deleteFile} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleDelete(doc)}/>
                    </td>
                </div>
            );
        }
        else{
            let filePath = 'http://localhost:3004/'+doc.DocPath+doc.DocName;
            filePath = filePath.replace("/public","");
            return(
                <div>
                    <td>
                        <img src={file} height={'30px'} width={'30px'} alt={'Not available'}/>
                    </td>
                    <td>
                        <a href={filePath}>
                            {doc.DocName}
                        </a>
                    </td>
                    <td>
                        <img src={deleteFile} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleDelete(doc)}/>
                    </td>
                </div>
            );
        }
    };

    displayBackButton = () => {
        if(this.st.currentPath === './public/upload/'+ this.state.email +'/'){
            return (<td></td>);
        }
        else{
            return (<td> Go Back :  <button type="button" className="btn btn-link" onClick = {() => this.navigateBackFolder(this.st)} > ... </button> </td>);
        }
    };

    render() {
        return (

            <div className="container-fluid">

                <Route exact path="/" render={() => (
                    <SignIn message={this.state.signInMessage} username={this.state.username} handleSignIn={this.handleSignIn} />
                )}/>

                <Route exact path="/SignUp" render={() => (
                    <SignUp message={this.state.signUpMessage} username={this.state.username} handleSignUp={this.handleSignUp} />
                )}/>

                <Route exact path="/SignIn" render={() => (
                    <SignIn message={this.state.signInMessage} username={this.state.username} handleSignIn={this.handleSignIn} />
                )}/>

                <Route exact path="/HomePage" render={() => (
                    <Homepage email={this.state.email} username={this.state.username} handleSignOut={this.handleSignOut}
                              handleFileUpload={this.state.handleFileUpload} handleFolderCreation={this.state.handleFolderCreation}
                              handleStarAction={this.state.handleStarAction} handleDelete={this.state.handleDelete}
                              navigateFolder={this.state.navigateFolder} navigateBackFolder={this.state.navigateBackFolder}
                              displayStar={this.state.displayStar} displayDocument={this.state.displayDocument}
                              displayBackButton={this.state.displayBackButton}/>
                )}/>

                <Route exact path="/Files" render={() => (
                    <Files email={this.state.email} username={this.state.username} handleSignOut={this.handleSignOut}
                           handleFileUpload={this.state.handleFileUpload} handleFolderCreation={this.state.handleFolderCreation}
                           handleStarAction={this.state.handleStarAction} handleDelete={this.state.handleDelete}
                           navigateFolder={this.state.navigateFolder} navigateBackFolder={this.state.navigateBackFolder}
                           displayStar={this.state.displayStar} displayDocument={this.state.displayDocument}
                           displayBackButton={this.state.displayBackButton}/>
                )}/>

                <Route exact path="/Activity" render={() => (
                    <Activity email={this.state.email} username={this.state.username} handleSignOut={this.handleSignOut} />
                )}/>

                <Route exact path="/Profile" render={() => (
                    <Profile email={this.state.email} username={this.state.username} handleSignOut={this.handleSignOut} />
                )}/>

            </div>

        );
    }
}

export default withRouter(RoutingComponent);