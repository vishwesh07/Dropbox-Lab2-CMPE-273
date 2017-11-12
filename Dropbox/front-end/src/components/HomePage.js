import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as API_UploadFile from '../api/API_UploadFile';
import * as API_CreateFolder from '../api/API_CreateFolder';
import * as API_GetFiles from '../api/API_GetFiles';
import * as API_StarAction from '../api/API_StarAction';
import strImg from '../components/stared.jpg';
import unstrImg from '../components/unstared.png';
import file from '../components/file.png';
import folder from '../components/folder.png';
import deleteFile from '../components/delete.png';
import * as API_DeleteDoc from "../api/API_DeleteDoc";
import * as API_IsSignedIn from "../api/API_IsSignedIn";
import shareDoc from "../components/share.png";

class HomePage extends Component{

    constructor(props) {
        super(props);
        this.st = {currentPath: './public/upload/'+ this.props.email +'/'};
        this.state = {
            userData: {
                email: this.props.email,     // problem
                username: '',
                user_docs: []
            },
            message: '',
            foldername : '',
            currentPath : './public/upload/'+ this.props.email +'/'
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
    }

    componentDidMount() {

        let state = this.state;
        console.log("In Did Mount "+state.currentPath+" email "+ this.props.email );

        API_GetFiles.getDocs(state)
            .then((data) => {
                console.log(data);
                this.setState({
                        ...this.state,
                        user_docs: data.docArr
                });
            });
    };

    handleFileUpload = (event) => {

        const payload = new FormData();

        payload.append('file', event.target.files[0]);

        payload.append('currentPath',this.st.currentPath);

        API_UploadFile.uploadFile(payload)
            .then((status) => {

                if (status === 204) {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            this.setState({
                                ...this.state,
                                user_docs: data.docArr,
                            });
                        });
                }

                else if(status === 403){
                    this.setState({
                        ...this.state,
                        message: '!! Similar file already exists. !!'
                    });
                }

            });
    };

    handleFolderCreation = () => {

        this.st.foldername = this.state.foldername;

        console.log("In handleFolderCreation "+this.st.currentPath+" "+this.st.foldername);

        API_CreateFolder.createFolder(this.st)
            .then((status) => {

                if (status === 201) {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            this.setState({
                                ...this.state,
                                user_docs: data.docArr,
                                message: ''
                            });
                        });
                }

                else if(status === 403){
                    this.setState({
                        ...this.state,
                        message: '!! Similar folder already exists. !!'
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
                            user_docs: data.docArr
                        });
                    });
        });
    };

    handleDelete = (doc) => {

        console.log(doc);

        if (doc.DocType === "folder") {

            API_DeleteDoc.deleteFolder(doc)
                .then((res) => {
                    API_GetFiles.getDocs(this.st)
                        .then((data) => {
                            console.log(data);
                            this.setState({
                                ...this.state,
                                user_docs: data.docArr
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
                                user_docs: data.docArr
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
                    user_docs: data.docArr
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
                    user_docs: data.docArr
                });
            });
    };

    displayStar = (doc) => {
        console.log("Value of star is "+ doc.Star+" doc : "+doc);
        if(doc.Star === 0){
            return (<img src={unstrImg} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
        else{
            return (<img src={strImg} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
    };

    displayIcon = (doc) => {

        if(doc.DocType === "folder") {

            return (<img src={folder} height={'30px'} width={'30px'} alt={'Not available'}/>);

        }
        else{

            return(<img src={file} height={'30px'} width={'30px'} alt={'Not available'}/>);

        }
    };

    displayDocument = (doc) => {
        if(doc.DocType === "folder"){
            return (
                    <button type="button" className="btn btn-link" onClick = {(event) => this.navigateFolder(event)} value={doc.DocName} > {doc.DocName} </button>
            );
        }
        else{
            let filePath = 'http://localhost:3004/'+doc.DocPath+doc.DocName;
            filePath = filePath.replace("/public","");
            return(
                        <a href={filePath}>
                            {doc.DocName}
                        </a>
            );
        }
    };

    displayUserName = () => {
        return(
            <div>
                {this.props.username}
            </div>
        );
    };

    displayDocPath = (doc) => {
        return(
            <div>
                <p style={{verticalAlign: "center"}}>{doc.DocPath}</p>
            </div>
        );
    };

    displayBackButtonLogic = () => {
        if(this.st.currentPath === './public/upload/'+ this.props.email +'/'){
            return;
        }
        else{
            return (
                <div>
                    Go Back :  <button type="button" className="btn btn-link" onClick = {() => this.navigateBackFolder(this.st)} > ... </button>
                </div>
            );
        }
    };

    displayShare = (doc) => {

        return (<img src={shareDoc} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);

    };

    displayDelete = (doc) => {

        return (<img src={deleteFile} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleDelete(doc)}/>);

    };

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

    render() {

        console.log("In RENDER HomePage");

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

                                {this.state.message}

                                <div className="form-group">
                                    <label>Folder Name *</label>
                                    &nbsp; &nbsp; &nbsp;
                                    <input
                                        type="text"
                                        name="folderName"
                                        className="span3"
                                        placeholder="Enter Folder Name"
                                        required="required"
                                        autoFocus="autoFocus"
                                        onChange={(event) => {
                                            this.setState({
                                                ...this.state,
                                                foldername: event.target.value
                                            });
                                        }}
                                    />
                                </div>

                                <input
                                    type="button"
                                    value="Create Folder"
                                    className="btn"
                                    onClick={this.handleFolderCreation}
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
                            <div className="col-sm-9 col-md-10 main"  style={{float: 'left'}}>
                                <h1 className="page-header">

                                    Welcome

                                    <br/> {this.props.username}

                                </h1>

                                <br/>

                                <div className="table-responsive">

                                    {this.displayBackButtonLogic()}

                                    <br/>

                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th style={{textAlign: 'center'}}>Favorite</th>
                                            <th></th>
                                            <th style={{textAlign: 'center'}}>DocName</th>
                                            <th style={{textAlign: 'center'}}>Owner</th>
                                            <th style={{textAlign: 'center'}}>DocPath</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.user_docs && (this.state.user_docs.map(doc => (
                                            <tr>
                                                <td>{this.displayStar(doc)}</td>
                                                <td>{this.displayIcon(doc)}</td>
                                                <td>{this.displayDocument(doc)}</td>
                                                <td>{this.displayUserName()}</td>
                                                <td>{this.displayDocPath(doc)}</td>
                                                <td>{this.displayShare(doc)}</td>
                                                <td>{this.displayDelete(doc)}</td>
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