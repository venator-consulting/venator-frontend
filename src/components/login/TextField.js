import React from 'react'
import TextField from "@material-ui/core/TextField";

const  Textfield = () => {


    return (
        <TextField
        variant="outlined"
        className="mb-4"
        margin="normal"
        fullWidth
        type="password"
        name="passwort"
        label="Passwort"
        onChange={this.passwortChangeHandle}
      />
        )
}

export default Textfield
