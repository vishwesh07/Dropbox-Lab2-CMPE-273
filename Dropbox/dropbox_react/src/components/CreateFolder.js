import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';

class CreateFolder extends Component{

    getFolderName = (event) => {
        this.props.getFolderName(event);
    };

    render(){
        return(
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
                    onChange={(event) =>
                        this.getFolderName(event)
                    }
                />

                <br/>

                <input
                    type="button"
                    value="Create Folder"
                    className="btn"
                    onClick={ () => this.props.handleFolderCreation}
                />

            </div>

        );
    }

}

export default withRouter(CreateFolder);