import React, { Component } from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Container from "./Container";
import { Grid } from "@material-ui/core";
// import { connect } from 'react-redux'

class Login extends Component {

  constructor(props) {
    super(props);
    this.benutzernameChangeHandle = this.benutzernameChangeHandle.bind(this);
    this.passwortChangeHandle = this.passwortChangeHandle.bind(this);
    this.einloggenHandle = this.einloggenHandle.bind(this);
    this.passwortVergessen = this.passwortVergessen.bind(this);
  }
  state = {
    url_Reducer: this.props.url_Reducer,
    kunden: [],
    benutzer: [],
    adminstrator: [],
    benutzername: "",
    benutzerTyp: "",
    benutzerId: "",
    benutzerRolle: "",
    passwort: "",
    name: "",
    logged: false,
    errorMessage: "",
    benutzernameError: "",
    passwortError: "",
    ValidatePassword: false,
    benutzerValidatePassword: false,
    adminValidatePassword: false,
    passwortVergessenAnzeigen: false,
    loginAnzeigen: true
  };

  componentDidMount() {
    axios
      .get(`${this.state.url_Reducer}/api/kunden/`)
      .then(response => {
        this.setState({
          kunden: response.data
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          errorMessage: "Fehler beim Laden"
        });
      });
    axios
      .get(`${this.state.url_Reducer}/api/benutzer/`)
      .then(response => {
        this.setState({
          benutzer: response.data
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          errorMessage: "Fehler beim Laden"
        });
      });
    axios
      .get(`${this.state.url_Reducer}/api/adminstrator/`)
      .then(response => {
        this.setState({
          adminstrator: response.data
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          errorMessage: "Fehler beim Laden"
        });
      });
      

  }
  validatePassword(username, password) {
    axios.get(`${this.state.url_Reducer}/api/kunden/validatePassword/${username}/${password}`)
      .then(response => {
        this.setState({
          ValidatePassword: true
        });
      })
      .catch(error => {
        this.setState({
          ValidatePassword: false
        });
      });
  }

  einloggenHandle() {

    let benutzernameError = "";
    let passwortError = "";

    if (!this.state.benutzername) {
      benutzernameError = "Der Benutzername ist erforderlich ";
    }
    if (this.state.benutzername && this.state.benutzername.length < 3) {
      benutzernameError = "Der Benutzername ist zu kurz "
    }
    if (!this.state.passwort) {
      passwortError = "Das Passwort ist erforderlich ";
    }
    if (this.state.passwort && this.state.passwort.length < 3) {
      passwortError = "Das Passwort ist zu kurz "
    }
    if (benutzernameError || passwortError) {
      this.setState({ benutzernameError, passwortError })
      return false;
    }
    // EInloggen
    let istBenutzer = false;

    // wenn der Benutzername ein Benutzer ist


    this.state.benutzer.map(user => {
      if ((user.benutzername === this.state.benutzername) || (user.email === this.state.benutzername)) {
        istBenutzer = true;
        axios.get(`${this.state.url_Reducer}/api/benutzer/validatePassword/${this.state.benutzername}/${this.state.passwort}/login`)
          .then((response) => {
            if (response.data === "falsches Passwort") {
              this.setState({
                errorMessage: "Das Passwort ist falsch",
                logged: false,
                benutzerTyp: ""
              })
            } else {
              this.setState({
                logged: true,
                ValidatePassword: true,
                benutzerTyp: "kunde",
                benutzerId: user.id,
                name: response.data[0].vorname + " " + response.data[0].nachname,
                benutzerRolle: user.rolle,
                benutzernameError: "",
                passwortError: "",
                errorMessage: ""
              },() => { this.props.signIn(this.state.logged)})
            }
          })
          .catch(err => {
            console.log(err.data)
          })
      }
    })

    // wenn der Benutzername ein Admin ist
    this.state.adminstrator.map(user => {
      if (
        (user.benutzername === this.state.benutzername || user.email === this.state.benutzername)
      ) {
        istBenutzer = true;
        axios.get(`${this.state.url_Reducer}/api/admin/validatePassword/${this.state.benutzername}/${this.state.passwort}/login`)
          .then(response => {
            if (response.data === "falsches Passwort") {
              this.setState({
                errorMessage: "Das Passwort ist falsch",
                logged: false,
                benutzerTyp: ""
              })
            } else {
             
              this.setState({
                logged: true,
                benutzerTyp: "admin",
                name: response.data[0].benutzername,
                benutzernameError: "",
                passwortError: "",
                errorMessage: ""
              },() => { this.props.signIn(this.state.logged)});
            }

          })
          .catch(err => {
            console.log(err.data)
          })

      }

    })
    if (istBenutzer === false) {
      this.setState({
        errorMessage: "Der Benutzer existiert nicht auf der Datenbank",
        logged: false,
        benutzerTyp: ""
      })
    }
  }
  benutzernameChangeHandle(e) {
    this.setState({
      benutzername: e.target.value
    });
  }
  passwortChangeHandle(e) {
    this.setState({
      passwort: e.target.value
    });
  }

  passwortVergessen() {
    if (this.state.passwortVergessenAnzeigen === false) {
      this.setState({
        passwortVergessenAnzeigen: true,
        loginAnzeigen: false

      })
    }
  }
  render() {

    return (
      <>
        {!this.state.logged && this.state.loginAnzeigen
          ? <Container component="main" maxWidth="xs" />
          : null}
{/*         {this.state.logged
          ? <Template name={this.state.name} benutzerTyp={this.state.benutzerTyp} username={this.state.benutzername} benutzerRolle={this.state.benutzerRolle} benutzerId={this.state.benutzerId} />
          : null} */}

{/*         {this.state.errorMessage && !this.state.logged ? (
          <Typography style={useStyles.errorMsg} > {this.state.errorMessage}</Typography>
        ) : null} */}


      </>
    );
  }
}
export default Login; 


