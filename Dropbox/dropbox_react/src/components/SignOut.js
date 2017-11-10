import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';

class SignOut extends Component{

    render(){

        return(
            <div>
                <input
                    type="button"
                    value="Sign Out"
                    className="btn btn-primary"
                    onClick={this.props.handleSignOut}
                />
            </div>
        );

    }

}

export default withRouter(SignOut);