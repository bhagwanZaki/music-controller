import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component{

    // defaultProps is a built in variable
    static defaultProps = {
        votesToSkip : 2,
        guestCanPause: true,
        update : false,
        roomCode: null,
        updateCallBack: () => {},
    };

    constructor(props){
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg : "",
        };
    
        this.handleRoomButton = this.handleRoomButton.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleupdateButton = this.handleupdateButton.bind(this);
    }

    handleVotesChange(e){
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButton(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // this is data that will be send 
            body: JSON.stringify({
              votes_to_skip: this.state.votesToSkip,
              guest_can_pause: this.state.guestCanPause,
            }),
          };
          // this will basically send the data to api views through the url
          fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => this.props.history.push("/room/" + data.code));
        }

    handleupdateButton(){
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            // this is data that will be send 
            body: JSON.stringify({
              votes_to_skip: this.state.votesToSkip,
              guest_can_pause: this.state.guestCanPause,
              code: this.props.roomCode,
            }),
          };
          // this will basically send the data to api views through the url
          fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok){
                    this.setState({
                        successMsg : "Room Updated sucessfully ...."
                    });
                } else {
                    this.setState({
                        errorMsg : "Update error ... Try Again !!"
                    });
                }
                this.props.updateCallBack();
            });
        }

        renderCreateButtons(){
            return(
                <Grid container spacing={1}>
                    <Grid item xs ={12} align="center">
                        <Button color="secondary" variant="contained" onClick={this.handleRoomButton}>
                            Create Room
                        </Button>
                    </Grid>
                    <Grid item xs ={12} align="center">
                        <Button color="primary" variant="contained" to="/" component={Link} >
                            Back
                        </Button>
                    </Grid>
                </Grid>
            )
        }

        renderUpdaeButons(){
            return(
                <Grid container spacing={1}>
                     <Grid item xs ={12} align="center">
                        <Button color="primary" variant="contained" onClick={this.handleupdateButton}>
                            Update Room
                        </Button>
                    </Grid>
                </Grid>
            )
        }

    render(){
        const title = this.props.update ? "Update a Room" :"Create a Room"
        return (
            <Grid container spacing={1}>
                <Grid item xs ={12} align="center">
                    <Collapse in={ this.state.errorMsg != "" || this.state.successMsg != ""}>
                        {this.state.successMsg != ""  ? (
                        <Alert 
                            severity="success" 
                            onClose={
                                () => {
                                    this.setState({ successMsg: "" })
                                } }>
                                    {this.state.successMsg}
                        </Alert>) : (
                        <Alert 
                            severity="error" 
                            onClose={
                                () => {
                                    this.setState({ errorMsg: "" })} 
                                }>
                                    {this.state.errorMsg}
                        </Alert>)
                    }
                    </Collapse>
                </Grid>
                <Grid item xs ={12} align="center">
                    <Typography compoenent='h4' variant='h4'>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs ={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Guest Control of playback state
                            </div>
                        </FormHelperText>
                        <RadioGroup
                        row
                        defaultValue={this.props.guestCanPause.toString()}
                        onChange={this.handleGuestCanPauseChange}
                        >
                             <FormControlLabel
                                value="true"
                                control={<Radio color="primary" />}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            />
                            <FormControlLabel  value="false" control={<Radio color="secondary" />}
                            label="No control" 
                            labelPlacement="bottom"
                        />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs ={12} align="center">
                    <FormControl>
                        <TextField
                    required={true}
                    type="number"
                    onChange={this.handleVotesChange}
                    defaultValue={this.state.votesToSkip}
                    inputProps={{
                        min: 1,
                        style: { textAlign: "center" },
                    }}
                    />
                        <FormHelperText>
                            <div align="center">
                                Votes required to skip song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdaeButons(): this.renderCreateButtons()}
            </Grid>
        );
    }
}