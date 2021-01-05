//  Main page

import React , {Component} from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import CreateRoomPage from "./createroompage";
// import { Link } from "react-router-dom"
import MusicPlayer from "./musicplayer";
export default class Room extends Component{
    constructor(props){
        super(props);
        this.state = {
            votesToskip: 2,
            guestCanPause: false,
            isHost: false,
            showSetting: false,
            spotifyAuthenticated : false,
            song: {},
        };
        this.roomCode = this.props.match.params.roomCode;
        this.getRoomDetails();
        this.leaveButtonPress = this.leaveButtonPress.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingbutton = this.renderSettingbutton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticatedSpotify = this.authenticatedSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    getCurrentSong(){
        fetch("/spotify/current-song").then((response) =>{
            if(!response.ok){
                return {};
            } else {
                return response.json();
            }
        }).then((data) => {
            this.setState({
                song : data,
            });
            // console.log(data);
        });
    }
    
    getRoomDetails(){
        fetch('/api/get-room' + '?code=' + this.roomCode)
        .then((response) => {
            if(!response.ok){
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                votesToskip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if(this.state.isHost){     
                this.authenticatedSpotify();
            }
        });
    }

    authenticatedSpotify(){
        fetch('/spotify/is-authenticated').then((response) => response.json()).then((data) => {
            this.setState({
                spotifyAuthenticated: data.status,
            });
            if (!data.status){
                fetch('/spotify/get-auth-url').then((response) => response.json()).then((data) =>{
                    window.location.replace(data.url);
                });
            }
        });
    }

    leaveButtonPress(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          };
        fetch('/api/leave-room',requestOptions).then((_response)=> {
            this.props.leaveRoomCallback();
            this.props.history.push("/");
        });
    }
    
    updateShowSettings(value){
        this.setState({
            showSetting: value,
        });
    }

    renderSettingbutton(){
        return(
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)} >
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings(){
        return(
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                update={true} 
                votesToSkip ={this.state.votesToskip} 
                guestCanPause={this.state.guestCanPause} 
                roomCode={this.roomCode} 
                updateCallBack={this.getRoomDetails}></CreateRoomPage>
            </Grid>
            <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained" onClick={() => this.updateShowSettings(false)} >
                Close        
            </Button>
            </Grid>
        </Grid>);
    }

    render(){
        if (this.state.showSetting){
            return this.renderSettings();
        }
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song} />
                {/* {this.state.song} */}
                {this.state.isHost ? this.renderSettingbutton() : null}
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.leaveButtonPress} >
                        Leave the room
                    </Button>
                </Grid>
            </Grid>
        )
    }
}