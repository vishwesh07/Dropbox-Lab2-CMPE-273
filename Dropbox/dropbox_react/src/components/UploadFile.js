import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';

class UploadFile extends Component{


    handleFileUpload = (event) => {
        this.props.handleFileUpload(event);
    };

    render(){

        return(
            <div className="upload-btn-wrapper">
                <button className="btn">Upload a file</button>
                <input className={'fileupload'} type="file" name="myfile" onChange={ (event) => this.handleFileUpload}/>
            </div>
        );

    }

}

export default withRouter(UploadFile);
