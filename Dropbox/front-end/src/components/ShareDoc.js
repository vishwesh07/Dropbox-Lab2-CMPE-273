import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as API_GetFiles from '../api/API_GetFiles';
import * as API_StarAction from '../api/API_StarAction';
import strImg from '../components/stared.jpg';
import unstrImg from '../components/unstared.png';
import file from '../components/file.png';
import folder from '../components/folder.png';
import deleteFile from '../components/delete.png';
import * as API_DeleteDoc from "../api/API_DeleteDoc";
import * as API_IsSignedIn from "../api/API_IsSignedIn";
import * as API_handleShareDoc from "../api/API_ShareDoc";
import * as API_handleUnshareDoc from "../api/API_UnshareDoc";
import {shareDoc} from "../api/API_ShareDoc";

class ShareDoc extends Component{

    constructor(props) {
        super(props);
        this.st = {sharedByMePath : '', sharedWithMePath : '',};
        this.state = {
            username: '',
            email: this.props.email,
            message: '',
            sharedByMePath : '',
            sharedByMeDocs: [],
            sharedWithMePath : '',
            sharedWithMeDocs: []
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

        payload.append('myfile', event.target.files[0]);

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

                else if(status === 304){
                    this.setState({
                        ...this.state,
                        message: '!! Similar file already exists. !!'
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

    handleShare = (doc) => {
        let shareDoc = {
            DocName: doc.DocName,
            currentPath: doc.DocPath,
            shareFrom: doc.DocOwner,
            shareWith: ""
        };
        API_handleShareDoc.shareDoc(shareDoc)
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

    handleUnshare = (doc) => {
        let unshareDoc = [];
        API_handleUnshareDoc.unshareDoc(doc)
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

    displayShare = (doc) => {
        if(doc.Star === 0){
            return (<img src={shareDoc} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
        else{
            return (<img src={strImg} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleStarAction(doc)}/>);
        }
    };

    displayDocument = (doc) => {
        if(doc.DocType === "folder"){
            return (
                <div>

                    <img src={folder} height={'30px'} width={'30px'} alt={'Not available'}/>

                    <button type="button" className="btn btn-link" onClick = {(event) => this.navigateFolder(event)} value={doc.DocName} > {doc.DocName} </button>

                    <img src={deleteFile} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleDelete(doc)}/>

                </div>
            );
        }
        else{
            let filePath = 'http://localhost:3004/'+doc.DocPath+doc.DocName;
            filePath = filePath.replace("/public","");
            return(
                <div>
                    <img src={file} height={'30px'} width={'30px'} alt={'Not available'}/>

                    <a href={filePath}>
                        {doc.DocName}
                    </a>

                    <img src={deleteFile} height={'30px'} width={'30px'} alt={'Not available'} onClick={() => this.handleDelete(doc)}/>

                </div>
            );
        }
    };

    displayBackButton = () => {
        if(this.st.currentPath === './public/upload/'+ this.props.email +'/'){
            return (<td></td>);
        }
        else{
            return (<td> Go Back :  <button type="button" className="btn btn-link" onClick = {() => this.navigateBackFolder(this.st)} > ... </button> </td>);
        }
    };

    render() {

        console.log("In RENDER HomePage");

        return (

            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3 col-md-2 sidebar">

                        <br/> <br/>

                        <input
                            type="button"
                            value="Sign Out"
                            className="btn btn-primary"
                            onClick={this.props.handleSignOut}
                        />

                        <br/> <br/>

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

                        <br/> <br/>

                        <div className="upload-btn-wrapper">
                            <button className="btn">Upload a file</button>
                            <input className={'fileupload'} type="file" name="myfile" onChange={this.handleFileUpload}/>
                        </div>

                        <br/> <br/>

                        <a href={'Activity.js'}> Activity </a>

                    </div>
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                        <h1 className="page-header">
                            <br/> <br/>

                            Welcome

                            <br/> {this.props.username}

                        </h1>

                        {/*<br/> <br/>*/}

                        {/*Current Path : {this.st.currentPath}*/}

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
                                    {this.displayBackButton()}
                                    <td></td>
                                </tr>
                                {this.state.user_docs && (this.state.user_docs.map(doc => (
                                    <tr>
                                        <td>{this.displayStar(doc)}</td>
                                        <td>{this.displayDocument(doc)}</td>
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