/* import React from 'react'

function SAPUploadStepper() {
    return (
        <div>
            SAPUploadStepper
        </div>
    )
}

export default SAPUploadStepper */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Input, Select, MenuItem, Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(0),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    buttonCss: {
        marginLeft: "1rem",
        textAlign: "center"
    }
}));





const SAPUploadStepper = ({ procedureId, url_Reducer }) => {

    const classes = useStyles();
    const [activeStep, setactiveStep] = React.useState(0);
    const [importForm, setImportForm] = React.useState("")
    const steps = getSteps();
    const databaseFields = [
        'mdt',
        'buKr',
        'belegnr',
        'jahr1',
        'periode',
        'pos1',
        'bS',
        'koart',
        'sK',
        'hauptbuch',
        "kontoName",
        'gsBe',
        'partner',
        'sH',
        'betragTW',
        'betragHW',
        'hW2Betrag',
        'hW3Betrag',
        'skontoTW',
        'skontoHW',
        'skontoHW2',
        'skontoHW3',
        'zuordnung',
        'kreditor',
        'kreditorname',
        'debitor',
        'debitorname',
        'gkart',
        'gkSachkontonummer',
        'gkKreditornummer',
        'gkDebitornummer',
        'gkSachkontoname',
        'gkKreditorname',
        'gkDebitorname',
        'belegart',
        'buchdat',
        'belDatum',
        'uebergreifendeNr',
        'umrechDat',
        'referenz',
        'belegkopftext',
        'waehrg1',
        'steuerstandort',
        'bME',
        'menge',
        'kKrs',
        'pSPElement',
        'auftrag',
        'kostenst',
        'prctr',
        'werk',
        'anlage',
        'uNr',
        'ausglbel',
        'ausgleich',
        'nettoFaelligkeit',
        'text'
    ]

    // Basis Datei 
    const [basisFile, setBasisFile] = React.useState(null)
    const [basisFilename, setBasisFilename] = React.useState(null)
    const [basisFileHeader, setBasisFileHeader] = React.useState([])
    const [firstStepMsg, setFirstStepMsg] = React.useState("")
    const [spinner, setSpinner] = React.useState(false)
    const [helperFileHeaderMappingShow, sethelperFileHeaderMappingShow] = React.useState(false)
    // helperFile Array

    const [helperFileHeader, setHelperFileHeader] = React.useState([])
    const [helperFileName, setHelperFileName] = React.useState([])
    const [secondStepMsg, setSecondStepMsg] = React.useState("")
    const [helperFileMappingTableShow, setHelperFileMappingTableShow] = React.useState("")

    const [filesAndDatabaseFieldsObj, setFilesAndDatabaseFieldsObj] = React.useState({ basisFile: { databaseFields: [], filesFields: [] }, helperFile: { databaseFields: [], filesFields: [] } })
    const [selectedFilesIndex, setSelectedFilesIndex] = React.useState([])


    const [hilfsDateiFelder, setHilfsDateiFelder] = React.useState([])
    const [selectedDatenbankFeld, setSelectedDatenbankFeld] = React.useState("")
    const [deletedAlleDateienFelder, setDeletedAlleDateienFelder] = React.useState([])
    const [deleteDatenbankFelder, setDeleteDatabaseFields] = React.useState([])


    // Hilfsdateien
    const [helperFile, setHelperFile] = React.useState(null)
    const [currentHelperKeyField, setCurrentHelperKeyField] = React.useState("")
    const [currentBasisKeyField, setCurrentBasisKeyField] = React.useState("")
    const [currentHelperFileFieldsArray, setCurrentHelperFileFieldsArray] = React.useState([])
    const [currentBasisFileFieldsArray, setCurrentBasisFileFieldsArray] = React.useState([])
    const [dateienZahl, setDateienZahl] = React.useState(0)

    // Muster -- Head Datei 

    const [headdatei, setHeaddatei] = React.useState(null)
    const [headDateiFelderAnzeigen, setHeadDateiFelderAnzeigen] = React.useState(false)
    const [headMsg, setHeadMsg] = React.useState("")
    const [aktuellesHeaddateiFeld, setAktuellesHeaddateiFeld] = React.useState("")
    const [aktuellesHeadBasisFeld, setAktuellesHeadBasisFeld] = React.useState("")
    const [aktuellesHeaddateiFelderArray, setAktuellesHeaddateiFelderArray] = React.useState(["Mdt", "BuKr", "Belegnr"])
    const [aktuellesHeadBasisFelderArray, setAktuellesHeadBasisFelderArray] = React.useState(["Mdt", "BuKr", "Belegnr"])
    // Muster -- Sachkontenstammdaten Datei

    const [sachkontendatei, setSachkontendatei] = React.useState(null)
    const [sachkontenDateiFelderAnzeigen, setSachkontenDateiFelderAnzeigen] = React.useState(false)
    const [sachkontenMsg, setSachkontenMsg] = React.useState("")
    const [aktuellesSachkontendateiFeld, setAktuellesSachkontendateiFeld] = React.useState("")
    const [aktuellesSachkontenBasisFeld, setAktuellesSachkontenBasisFeld] = React.useState("")
    const [aktuellesSachkontendateiFelderArray, setAktuellesSachkontendateiFelderArray] = React.useState(["Mdt", "Sachkonto"])
    const [aktuellesSachkontenBasisFelderArray, setAktuellesSachkontenBasisFelderArray] = React.useState(["Mdt", "Hauptbuch"])

    // Muster -- Debitoren  Datei
    const [debitorendatei, setDebitorendatei] = React.useState(null)
    const [debitorenDateiFelderAnzeigen, setDebitorenDateiFelderAnzeigen] = React.useState(false)
    const [debitorenMsg, setDebitorenMsg] = React.useState("")
    const [aktuellesDebitorendateiFeld, setAktuellesDebitorendateiFeld] = React.useState("")
    const [aktuellesDebitorenBasisFeld, setAktuellesDebitorenBasisFeld] = React.useState("")
    const [aktuellesDebitorendateiFelderArray, setAktuellesDebitorendateiFelderArray] = React.useState(["Mdt", "BuKr", "Debitor"])
    const [aktuellesDebitorenBasisFelderArray, setAktuellesDebitorenBasisFelderArray] = React.useState(["Mdt", "BuKr", "Debitor"])
    // Muster -- Kreditoren Datei

    const [kreditorendatei, setKreditorendatei] = React.useState(null)
    const [kreditorenDateiFelderAnzeigen, setKreditorenDateiFelderAnzeigen] = React.useState(false)
    const [kreditorenMsg, setKreditorenMsg] = React.useState("")
    const [aktuellesKreditorendateiFeld, setAktuellesKreditorendateiFeld] = React.useState("")
    const [aktuellesKreditorenBasisFeld, setAktuellesKreditorenBasisFeld] = React.useState("")
    const [aktuellesKreditorendateiFelderArray, setAktuellesKreditorendateiFelderArray] = React.useState(["Mdt", "BuKr", "Kreditor"])
    const [aktuellesKreditorenBasisFelderArray, setAktuellesKreditorenBasisFelderArray] = React.useState(["Mdt", "BuKr", "Kreditor"])

    // datenbankFelder Array
    const [alleDateienFelder, setAlleDateienFelder] = React.useState([])
    // Felder der Datenbank verbinden
    const [currentFilesFieldsArray, setCurrentFilesFieldsArray] = React.useState([])
    const [currentFilesArrayIndex, setCurrentFilesArrayIndex] = React.useState(0)

    const [currentSelectedHelperField, setCurrentSelectedHelperField] = React.useState("")
    const [currentSelectedDatabaseField, setCurrentSelectedDatabaseField] = React.useState("")
    const [currentSelectedHelperFielderArray, setCurrentSelectedHelperFielderArray] = React.useState([])
    const [currentSelectedDatabaseFielderArray, setCurrentSelectedDatabaseFielderArray] = React.useState([])
    const [aktuellerDateiIndex, setAktuellerDateiIndex] = React.useState(0)
    const [erfolgMsg, setErfolgMsg] = React.useState([])
    const [basisUploadMsg, setBasisUploadMsg] = React.useState("")
    const [uploadSpinner, setUploadSpinner] = React.useState(false)


    // ++++++++++++++++ ImportForm auswählen

    const selectImportForm = e => {
        setImportForm(e.target.value)
    }
    // +++++++++++++++++++++++++++++++++ STANDARD IMPORT ++++++++++++++++++++++++++++++
    // ################ start the first Step 
    const onSubmitSAPbuchungen = () => {
        const formData = new FormData();
        formData.append("file", basisFile);
        if (basisFile) {
            //  axios.post(`${url_Reducer}/api/SAPsendBasisFile/${procedureId}`, formData)
            axios.post(`${url_Reducer}/api/SAPsendBasisFile`, formData)
                .then(setSpinner(true))
                .then(response => {
                    setBasisFileHeader(response.data.header)
                    setBasisFilename(response.data.filename)
                    setFirstStepMsg(response.data.filename + " wurde erfolgreich hochgeladen")
                    setSpinner(false)
                })
        } else {
            setFirstStepMsg("Laden Sie bitte die Datei hoch")
        }
    };
    const onChangeSAPbasisFile = e => {
        setBasisFile(e.target.files[0])
    };
    // ################ start second step
    const onChangeHelperFile = e => {
        setHelperFile(e.target.files[0])
    };
    const onSubmitHelperFile = () => {
        const formData = new FormData();
        formData.append("file", helperFile);
        if (helperFile) {

            axios.post(`${url_Reducer}/api/SAPsendHelperFile`, formData)
                .then(setSpinner(true))
                .then(response => {

                    setHelperFileHeader(response.data.header)
                    setHelperFileName(response.data.filename)
                    setSecondStepMsg(response.data.filename + " wurde erfolgreich hochgeladen")
                    setSpinner(false)
                    sethelperFileHeaderMappingShow(true)
                    console.log(helperFileName)
                    console.log(helperFileHeader)

                })
        } else {
            setSecondStepMsg("Laden Sie bitte die Datei hoch")

        }


    };

    const onChangeBasisKeyFields = e => {
        setCurrentBasisKeyField(e.target.value)
    }
    const onChangeHelperFileKeyFields = e => {
        setCurrentHelperKeyField(e.target.value)
    }
    const removeFieldFromMappingTable = (helperFileField, basisFileField) => {

        let helperFieldIndex = currentHelperFileFieldsArray.indexOf(helperFileField);
        if (helperFieldIndex > -1) {
            currentHelperFileFieldsArray.splice(helperFieldIndex, 1);
        }
        let basisFieldIndex = currentBasisFileFieldsArray.indexOf(basisFileField);
        if (basisFieldIndex > -1) {
            currentBasisFileFieldsArray.splice(basisFieldIndex, 1);
        }

        setCurrentHelperFileFieldsArray(currentHelperFileFieldsArray)
        setCurrentBasisFileFieldsArray(currentBasisFileFieldsArray)
        setHelperFileMappingTableShow(true)
    }
    const helperFileFiledsMapping = () => {
        let temp1 = currentHelperFileFieldsArray
        let temp2 = currentBasisFileFieldsArray
        temp1.push(currentHelperKeyField)
        temp2.push(currentBasisKeyField)

        setCurrentHelperFileFieldsArray(temp1)
        setCurrentBasisFileFieldsArray(temp2)
        if (currentHelperFileFieldsArray.length > 0 && currentBasisKeyField && setCurrentHelperKeyField) {
            setHelperFileMappingTableShow(true)
        }
        axios.post(`${url_Reducer}/api/helperFileWithBasisFileMapping/${currentHelperFileFieldsArray}/${currentBasisFileFieldsArray}`)
            .then(setSpinner(true))
            .then(response => {
                if (response.data.msg === "succesfully")
                    setSpinner(false)
            })

    }
    // ################ start third step
    const onChangeAllFilesNamesArray = e => {
        let name = e.target.value
        if (name === basisFilename) {
            setCurrentFilesFieldsArray(basisFileHeader)
            setSelectedFilesIndex(0)
        } else if (name === helperFileName) {
            setCurrentFilesFieldsArray(helperFileHeader)
            setSelectedFilesIndex(1)
        }
    }
    function onChangeSelectedField(databaseField, e) {
        setCurrentSelectedDatabaseField(databaseField)
        setCurrentSelectedHelperField(e.target.value)

    }
    const databaseFieldsMapping = (index, databaseField) => {

        let tempObj = filesAndDatabaseFieldsObj
        let temp1 = erfolgMsg

        if (currentSelectedDatabaseField && currentSelectedHelperField) {
            temp1[index] = 1
            // if the selected file is the basis file
            console.log(selectedFilesIndex)
            if (selectedFilesIndex === 0) {
                tempObj.basisFile.databaseFields.push(currentSelectedDatabaseField)
                tempObj.basisFile.filesFields.push(currentSelectedHelperField)
                // if the selected file is the helper file

            } else if (selectedFilesIndex === 1) {
                tempObj.helperFile.databaseFields.push(currentSelectedDatabaseField)
                tempObj.helperFile.filesFields.push(currentSelectedHelperField)
            }
            setFilesAndDatabaseFieldsObj(tempObj)
            setCurrentSelectedDatabaseField("")
            setCurrentSelectedHelperField("")
            setErfolgMsg(temp1)
        } else {
            temp1[index] = 0
            setErfolgMsg(temp1)
        }
        console.log(filesAndDatabaseFieldsObj)
        console.log(erfolgMsg)

    }
    // ################ start firth step
    const onSubmitBasisFile = (filename) => {

        console.log(filesAndDatabaseFieldsObj)
        setUploadSpinner(true)

        if (filename === basisFilename) {   // basis file

            axios.post(`${url_Reducer}/SAPbasisFileUpload/${procedureId}`, {
                filename: basisFilename,
                mappingFields: filesAndDatabaseFieldsObj.basisFile.filesFields,
                databaseFields: filesAndDatabaseFieldsObj.basisFile.databaseFields,
                header: basisFileHeader
            })
                .then(response => {
                    if (response.data.msg === "successfully") {
                        setUploadSpinner(false)
                        setBasisUploadMsg("Die Daten wurde erfolgreich hochgeladen!")
                    } else {
                        setUploadSpinner(false)
                        setBasisUploadMsg("Keine Buchungen wurden gefunden, versuchen Sie bitte erneut  !")
                    }
                })
        } else if (filename === helperFileName) {   // helper file
            axios.post(`${url_Reducer}/SAPhelperFileUpload/${procedureId}`, {
                filename: helperFileName,
                mappingFields: filesAndDatabaseFieldsObj.helperFile.filesFields,
                databaseFields: filesAndDatabaseFieldsObj.helperFile.databaseFields,
                header: helperFileHeader
            })
                .then(response => {
                    if (response.data.msg === "successfully") {
                        setUploadSpinner(false)
                        setBasisUploadMsg("Die Daten wurde erfolgreich hochgeladen!")
                    } else {
                        setUploadSpinner(false)
                        setBasisUploadMsg("Keine Buchungen wurden gefunden, versuchen Sie bitte erneut  !")
                    }
                })
        }
    }
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    function getStepContent(stepIndex) {
        if (importForm === "Standard") {
            switch (stepIndex) {
                case 0:
                    return (
                        <>
                            <Typography className="text-secondary " margin="normal"> Bitte die Basis-Datei auswählen </Typography>
                            <div className="form-inline mb-4">
                                <Input
                                    className="mb-4 mr-3"
                                    type="file"
                                    onChange={onChangeSAPbasisFile}
                                    defaultValue={null}
                                    placeholder=""
                                    value=""

                                />
                                <Button
                                    className={classes.buttonCss}
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={onSubmitSAPbuchungen}
                                    iconSizeMedium
                                />

                            </div>
                            {firstStepMsg ?
                                <Typography className="text-info mb-4 " margin="normal"> {firstStepMsg} </Typography>
                                : null}
                            {spinner ?
                                (
                                    <LinearProgress />
                                )
                                : null}

                        </>
                    );
                case 1:
                    return (
                        <>
                            <Typography className="text-secondary " margin="normal"> Bitte die Datei hochladen </Typography>
                            <div className="form-inline mb-4">
                                <Input
                                    className="mb-4 mr-3"
                                    type="file"
                                    onChange={onChangeHelperFile}
                                    defaultValue={null}
                                    placeholder=""
                                    value=""
                                />
                                <Button
                                    className={classes.buttonCss}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CloudUploadIcon />}
                                    onClick={onSubmitHelperFile}
                                />

                            </div>

                            {spinner ?
                                (
                                    <LinearProgress />
                                )
                                : null}
                            {helperFileHeaderMappingShow ?
                                <div className=" m-2 "  >
                                    <div className="mb-4" >
                                        <Select onChange={onChangeBasisKeyFields} displayEmpty >
                                            <MenuItem disabled>
                                                Basisdatei
                                            </MenuItem>
                                            {basisFileHeader.map(elem => (
                                                <MenuItem key={elem} value={elem}> {elem} </MenuItem>
                                            ))}
                                        </Select>

                                        <Select onChange={onChangeHelperFileKeyFields} className="ml-4" displayEmpty >
                                            <MenuItem disabled>
                                                Hilfsdatei
                                                            </MenuItem>
                                            {helperFileHeader.map(elem => (
                                                <MenuItem key={elem} value={elem}> {elem} </MenuItem>
                                            ))}
                                        </Select>
                                        <Button
                                            className="ml-4"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => helperFileFiledsMapping()}

                                        >
                                            Veknüpfen
                                        </Button>
                                    </div>
                                </div>
                                : null}

                            {secondStepMsg ?
                                <Typography className="text-info mb-4 mt-2" margin="normal"> {secondStepMsg} </Typography>
                                : null}
                            {helperFileMappingTableShow ?
                                <div>
                                    <Table className="table">
                                        <TableBody>
                                            {currentHelperFileFieldsArray.map((elem, index) => (
                                                <TableRow>
                                                    <TableCell className="table-secondary"> {currentBasisFileFieldsArray[index]} </TableCell>
                                                    <TableCell className="table-secondary"> <SwapHorizIcon /> </TableCell>
                                                    <TableCell className="table-secondary"> {elem} </TableCell>
                                                    <TableCell className="table-secondary">
                                                        <Button
                                                            className={classes.buttonCss}
                                                            variant="contained"
                                                            color="secondary"
                                                            startIcon={<CloseIcon />}
                                                            onClick={() => removeFieldFromMappingTable(elem, currentBasisFileFieldsArray[index])}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}


                                        </TableBody>
                                    </Table>
                                </div>
                                : null}

                        </>
                    );
                case 2:
                    return (
                        <Table className="table-hover m-2">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ color: "#E9967A" }}>Felder der Datenbank</TableCell>
                                    <TableCell style={{ color: "#E9967A" }}>Datei</TableCell>
                                    <TableCell style={{ color: "#E9967A" }}>Feld</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {databaseFields.map((element, index) => (
                                    <TableRow>
                                        <TableCell>
                                            <Typography className="text-secondary" margin="normal"> {element} </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Select onChange={onChangeAllFilesNamesArray} displayEmpty >
                                                <MenuItem disabled>  Datei </MenuItem>
                                                <MenuItem key={basisFilename} value={basisFilename}> {basisFilename} </MenuItem>
                                                <MenuItem key={helperFileName} value={helperFileName}> {helperFileName} </MenuItem>

                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select onChange={(e) => onChangeSelectedField(element, e)} displayEmpty >
                                                <MenuItem disabled>
                                                    Feld
                                                </MenuItem>
                                                {currentFilesFieldsArray.map(elem => (
                                                    <MenuItem key={elem} value={elem}> {elem} </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                className="ml-4"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    databaseFieldsMapping(index, databaseFields[index])
                                                }}
                                            >
                                                Veknüpfen
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {erfolgMsg[index] === 1 ? <CheckIcon style={{ color: "green" }} /> : null}

                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>

                        </Table>


                    );
                case 3:
                    return (
                        <div>
                            <div>
                                <div className="form-inline mb-4 ">
                                    <Typography className="text-secondary mr-3" margin="normal"> {basisFilename} </Typography>
                                    <Button
                                        className={classes.buttonCss}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => { onSubmitBasisFile(basisFilename) }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="form-inline mb-4 ">
                                    <Typography className="text-secondary mr-3" margin="normal"> {helperFileName} </Typography>
                                    <Button
                                        className={classes.buttonCss}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CloudUploadIcon />}
                                        onClick={() => { onSubmitBasisFile(helperFileName) }}
                                    />
                                </div>
                            </div>
                            <div>
                                {basisUploadMsg && !uploadSpinner ? <Typography className="text-info"> {basisUploadMsg} </Typography> : null}
                                {uploadSpinner ? <LinearProgress /> : null}
                            </div>
                        </div>
                    );
                case 4:
                    return (
                        <Typography className="text-success" margin="normal"> Das Verfahren wurde importiert </Typography>
                    );
            }
        }
    }
    function getSteps() {
        if (importForm === "Standard")
            return ['Basisdatei importieren', 'Hilfsdateien importieren', 'Felder verbinden', 'Dateien hochladen'];
        else if (importForm === "Muster")
            return ['Basisdatei importieren', 'Headdatei importieren', 'Sachkontenstamm importieren', 'Debitoren importieren', 'Kreditoren importieren', 'Felder verbinden', 'Dateien hochladen'];
        else
            return [];
    }
    const handleNext = () => {
        if (importForm === "Standard") {

            if (activeStep === 0) {
                if (basisFile && basisFileHeader.length > 0) {
                    setactiveStep(prevactiveStep => prevactiveStep + 1);
                }
                else
                    setFirstStepMsg("Laden Sie bitte die Datei hoch")
            } else if (activeStep === 1) {
                if (helperFile && helperFileHeader.length > 0) {
                    setactiveStep(prevactiveStep => prevactiveStep + 1);
                }
                else {
                    setactiveStep(prevactiveStep => prevactiveStep + 1);
                }
            } else if (activeStep === 2) {
                setactiveStep(prevactiveStep => prevactiveStep + 1);

            }
            else if (activeStep === 3) {
                setactiveStep(prevactiveStep => prevactiveStep + 1);
            }
        }

    };
    const handleBack = () => {
        setFirstStepMsg("")
        setactiveStep(prevactiveStep => prevactiveStep - 1);
    };
    const handleMore = () => {
        setHelperFile(null)
        setSecondStepMsg("")
        sethelperFileHeaderMappingShow(false)
        setCurrentHelperKeyField("")
        setCurrentBasisKeyField("")
        setCurrentHelperFileFieldsArray([])
        setCurrentBasisFileFieldsArray([])

    };

    const handleReset = () => {
        setactiveStep(0);
    };

    return (
        <div className={classes.root}>
            <Select onChange={selectImportForm} displayEmpty >
                <MenuItem disabled>
                    Importform auswählen
                    </MenuItem>
                <MenuItem value="Muster">Muster Import</MenuItem>
                <MenuItem value="Standard">Standard Import</MenuItem>

            </Select>
            {importForm ?
                <>
                    <Stepper className="mb-4" activeStep={activeStep} alternativeLabel>
                        {steps.map(label => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        {activeStep !== steps.length ? (
                            <div className="mt-8">
                                <div>{getStepContent(activeStep)}</div>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.backButton}
                                    >
                                        Zurück
                                    </Button>
                                    {importForm === "Standard" ?
                                        <Button
                                            disabled={activeStep !== 1}
                                            onClick={handleMore}
                                            className={"ml-2 " + classes.backButton}
                                            variant="contained"
                                        >
                                            Weitere
                                        </Button>
                                        : null}

                                    <Button className="ml-2" variant="contained" onClick={handleNext}>
                                        {activeStep === steps.length - 1 ? 'Fertig' : 'Nächste'}
                                    </Button>

                                </div>
                            </div>
                        )
                            :
                            <Typography className="text-success" margin="normal"> Das Verfahren wurde importiert </Typography>

                        }
                    </div>
                </>
                : null}

        </div>
    );
}


export default SAPUploadStepper;
