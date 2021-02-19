import React, { useState, useEffect } from 'react'
import { FormHelperText, FormControl, MenuItem, Select, Typography } from "@material-ui/core/";
import axios from "axios"
import SAPUploadStepper from "./SAPUploadStepper";
import DatevUploadStepper from "./DatevUploadStepper";
import LexwareUploadStepper from "./LexwareUploadStepper";

const UploadForm = () => {
    const [url_Reducer, setURL_Reducer] = useState("")
    const [programsArray, setProgramsArray] = useState(["SAP", "Datev", "Lexware"])
    const [allManagers, setAllManagers] = useState([])
    const [managerProcedures, setManagerProcedures] = useState([])
    const [selectedProgram, setSelectedProgram] = useState("")
    const [procedureId, setProcedureId] = useState("")
    const [showManagerProcedures, setShowManagerProcedures] = useState(false)
    const [showSelectedProgram, setShowSelectedProgram] = useState(false)
    const [showSAPdata, setShowSAPdata] = useState(false)
    const [showDatevData, setShowDatevData] = useState(false)
    const [showLexwareData, setShowLexwareData] = useState(false)




    const changeManagerProcedure = e => {
        setProcedureId(e.target.value)
        setShowSelectedProgram(true)
    }
    const changeSelectManager = e => {

        let selectedManagerId = e.target.value
        axios.get(`/api/getManagerProcedures/${selectedManagerId}`)
            .then(response => {
                setManagerProcedures(response.data)
                console.log(response.data)
            })
        setShowManagerProcedures(true)
    }
    const changeSelectProgram = e => {
        let program = e.target.value
        setSelectedProgram(program)

        if (program === "SAP") {
            setShowSAPdata(true)
            setShowDatevData(false)
            setShowLexwareData(false)
        } else if (program === "Datev") {
            setShowSAPdata(false)
            setShowDatevData(true)
            setShowLexwareData(false)
        } else if (program === "Lexware") {
            setShowSAPdata(false)
            setShowDatevData(false)
            setShowLexwareData(true)
        }
    }
    useEffect(() => {
        const fetchUsers = async () => {
            axios
                .get("/api/getAllManagers")
                .then(response => {
                    setAllManagers(response.data)
                    console.log(response.data)
                    console.log(allManagers)

                })
        }
        fetchUsers();
    }, [])
    return (
        <>
            <div className="m-4" style={{ width: "100%" }}>
                <div className="form-group">
                    <FormControl>
                        <FormHelperText> Kunde auswählen </FormHelperText>

                        <Select displayEmpty onChange={changeSelectManager} >
                            <MenuItem disabled key="-1">
                                Kunde auswählen
                            </MenuItem>
                            {allManagers.map(user => (
                                <MenuItem key={user.id} value={user.id}> {user.email} </MenuItem>
                            ))}

                        </Select>
                    </FormControl>

                </div>

                {showManagerProcedures ?
                    <div className="form-group">
                        <FormControl>
                            <FormHelperText> Verfahren auswählen </FormHelperText>
                            <Select onChange={changeManagerProcedure} displayEmpty>
                                <MenuItem value="" disabled key="-1">
                                    Verfahren auswählen
                                </MenuItem>
                                {managerProcedures.map(procedure => (
                                    <MenuItem key={procedure.id} value={procedure.id}>{procedure.name}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </div>

                    : null}


                {showSelectedProgram ?
                    <div className="form-group">

                        <FormControl>
                            <FormHelperText> Programm auswählen </FormHelperText>
                            <Select onChange={changeSelectProgram} displayEmpty>
                                <MenuItem value="" disabled key="-1">
                                    Programm auswählen
                                </MenuItem>
                                {programsArray.map(programname => (
                                    <MenuItem key={programname} value={programname}>{programname}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    : null}

                {showSAPdata ?
                    <SAPUploadStepper procedureId = {procedureId} url_Reducer = {url_Reducer} />
                    : null}
                {showDatevData ?
                    <DatevUploadStepper />
                    : null}
                {showLexwareData ?
                    <LexwareUploadStepper />
                    : null}
            </div>
        </>
    )
}

export default UploadForm
