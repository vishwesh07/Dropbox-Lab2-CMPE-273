import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';

class SignIn extends Component{

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                email: '',
                password: ''
            },
            message: ''
        };
    }

    componentWillMount(){
        if(this.props.username !== undefined){
            this.props.history.push("/HomePage");
        }
    }

    render() {

        console.log("In RENDER SignIn");

        return (

            <div className="container-fluid">
                <div className="row justify-content-md-center">
                    <div className="span3">
                        <form>

                            <br/> <br/> <br/> <br/> <br/> <br/>

                            <div className="form-group">
                                <h2>Sign In</h2>
                            </div>

                            <div className="col-md-12">
                                {this.props.message && (
                                    <div  className="alert alert-warning" role="alert">
                                        {this.props.message}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                <input
                                    type="email"
                                    name="email"
                                    className="span3"
                                    placeholder="Enter Email Address"
                                    required="required"
                                    value={this.state.userData.email}
                                    autoFocus="autoFocus"
                                    onChange={(event) => {
                                        this.setState({
                                            userData: {
                                                ...this.state.userData,
                                                email: event.target.value
                                            }
                                        });
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                &nbsp; &nbsp; &nbsp; &nbsp;
                                <input
                                    type="password"
                                    name="password"
                                    className="span3"
                                    placeholder="Enter Password"
                                    required="required"
                                    value={this.state.userData.password}
                                    onChange={(event) => {
                                        this.setState({
                                            userData: {
                                                ...this.state.userData,
                                                password: event.target.value
                                            }
                                        });
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="button"
                                    value="Sign In"
                                    className="btn btn-primary"
                                    style={{float: 'right'}}
                                    onClick={() => this.props.handleSignIn(this.state)}

                                />
                                <input
                                    type="button"
                                    value="Sign Up"
                                    className="btn btn-primary"
                                    style={{float: 'left'}}
                                    onClick={() => {
                                        this.props.history.push("/SignUp");
                                    }}
                                />
                            </div>

                        </form>



                    </div>
                </div>
            </div>

        );

    }
}

export default withRouter(SignIn);