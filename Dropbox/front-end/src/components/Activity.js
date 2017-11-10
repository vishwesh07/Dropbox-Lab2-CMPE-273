import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import * as API_Activity from "../api/API_Activity";

class Activity extends Component{

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,     // problem
            user_activity: ''
        };
    }

    componentDidMount(){

        API_Activity.getUserActivity(this.state.email)
            .then((data) => {
                console.log(data);
                this.setState({
                    ...this.state,
                    user_activity: data
                });
        });

    }

    displayActivity = (activity) => {
        if(activity.FileName !== null){
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

    render(){
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
                                    <th style={{textAlign: 'center'}}>TimeStamp</th>
                                    <th style={{textAlign: 'center'}}>ActivityName</th>
                                    <th style={{textAlign: 'center'}}>File</th>
                                </tr>
                                </thead>
                                <tbody>
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

export default withRouter(Activity);