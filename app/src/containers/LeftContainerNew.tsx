import React, { useState, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import ComponentPanel from '../components/left/ComponentPanelNew';
import HTMLPanel from '../components/left/HTMLPanelNew';
import GetAppIcon from '@material-ui/icons/GetApp';
import createModal from '../components/left/createModal';
import { stateContext } from '../context/context';
import exportProject from '../utils/exportProjectNew.util';
import { saveProject } from '../helperFunctions/projectGetSave';

const IPC = require('electron').ipcRenderer;

const useStyles = makeStyles({
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: '40px',
    left: '0px'
  },
  exportBtn: {
    width: '55%',
    backgroundColor: 'rgba(1,212,109,0.1)',
    fontSize: '1em'
  },
  clearBtn: {
    width: '55%',
    fontSize: '1em',
    marginTop: '15px',
    color: 'red'
  },
  formControl: {
    minWidth: '125px',
    backgroundColor: 'rgba(255,255,255,0.15)'
  }
});

// Left-hand portion of the app, where component options are displayed
const LeftContainer = (): JSX.Element => {
  const [state, dispatch] = useContext(stateContext);
  const [projectName, setProjectName] = useState('');
  const classes = useStyles();

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  // state to keep track of how the user wants their components to be exported
  // genOption = 0 --> export only components
  // genOption = 1 --> export an entire project w/ webpack, server, etc.
  const genOptions: string[] = [
    'Export components',
    'Export components with application files'
  ];
  const [genOption, setGenOption] = useState(1);
  // state to keep track of whether there should be a modal
  const [modal, setModal] = useState(null);

  const { components } = state.components;

  // closes out the open modal
  const closeModal = () => setModal('');

  // creates modal that asks if user wants to clear workspace
  // if user clears their workspace, then their components are removed from state and the modal is closed
  const clearWorkspace = () => {
    setModal(
      createModal({
        message: 'Are you sure want to delete all data?',
        closeModal: closeModal,
        secBtnLabel: 'Clear Workspace',
        open: true,
        children: null,
        primBtnAction: null,
        primBtnLabel: null,
        secBtnAction: () => {
          // TODO: Create reducer to delete components from state
          closeModal();
        }
      })
    );
  };

  const showGenerateAppModal = () => {
    console.log('creating Modal!');
    const children = (
      <List className="export-preference">
        {genOptions.map((option: string, i: number) => (
          <ListItem
            key={i}
            button
            onClick={() => chooseGenOptions(i)}
            // onClick={() =>
            //   createApplication({
            //     // path,
            //     // trying this with an absolute path because the electron dialogue box isn't working
            //     path: '/Users/tylersullberg/',
            //     components,
            //     genOption,
            //     appName: 'reactype_app',
            //     exportAppBool: null
            //   })
            // }
            style={{
              border: '1px solid #3f51b5',
              marginBottom: '2%',
              marginTop: '5%'
            }}
          >
            <ListItemText primary={option} style={{ textAlign: 'center' }} />
          </ListItem>
        ))}
      </List>
    );

    // helper function called by showGenerateAppModal
    // this function will prompt the user to choose an app directory once they've chosen their export option
    const chooseGenOptions = (genOpt: number) => {
      // set export option: 0 --> export only components, 1 --> export full project
      console.log('in chooseGenOptions');
      setGenOption(genOpt);
      console.log('Gen option is ', genOpt);
      // closeModal
      exportProject('/Users', 'NEW PROJECT', genOpt, state.components);
      closeModal();
      // Choose app dir
      // NOTE: This functionality isn't working right now. Will upgrade Electron and see if that fixes it
      //chooseAppDir();

      // exportProject('/Users/tylersullberg/', 'NEW PROJECT', 1);
    };

    const chooseAppDir = () => IPC.send('choose_app_dir');

    // when the user selects a directory from the modal,
    // we're going to create the application in their chosen directory
    IPC.on('app_dir_selected', (event: string, path: string) => {
      // createApplication({
      //   path,
      //   components,
      //   genOption,
      //   appName: 'reactype_app',
      //   exportAppBool: null
      // });
      // exportProject();
      console.log('app directory selected!!!');
    });

    setModal(
      createModal({
        closeModal,
        children,
        message: 'Choose export preference:',
        primBtnLabel: null,
        primBtnAction: null,
        secBtnAction: null,
        secBtnLabel: null,
        open: true
      })
    );
  };

  return (
    <div className="column left">
      <Grid container direction="row" alignItems="center">
        <ComponentPanel />
        <HTMLPanel />
        <div className={classes.btnGroup}>
          <Button
            className={classes.exportBtn}
            variant="outlined"
            color="primary"
            onClick={showGenerateAppModal}
            endIcon={<GetAppIcon />}
          >
            EXPORT PROJECT
          </Button>
          <Button className={classes.clearBtn}>CLEAR WORKSPACE</Button>
        </div>
      </Grid>
      <TextField
        className={classes.formControl}
        placeholder="Enter project name here"
        variant="filled"
        required
        name="projectName"
        label="projectName"
        value={projectName}
        onChange={handleName}
      />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          saveProject(state, projectName);
        }}
      >
        Sav Project
      </Button>
      {modal}
    </div>
  );
};

export default LeftContainer;