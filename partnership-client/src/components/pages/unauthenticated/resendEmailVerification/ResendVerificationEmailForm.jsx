import {
  Box,
  Button,
  Grid,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles({
  paper: {
    padding: '15 30',
    width: '100%',
  },
  btn: {
    backgroundColor: '#FF5E1F',
    color: '#fff',
    fontWeight: 'bold',
    transition: '0.3s',
    padding: '10 30',
    '&:hover': {
      backgroundColor: '#FF5E1F',
      opacity: '0.9',
    },
  },
});

export default function ResendVerificationEmailForm({
  errors,
  loading,
  onSubmit,
  register,
}) {
  const classes = useStyles();

  return (
    <Box
      bgcolor='#235d9f'
      display='flex'
      minHeight='100vh'
      width='100%'
      position='absolute'
      top={0}
      zIndex={999}
      justifyContent='center'
      alignItems='center'>
      <Grid container justify='center'>
        <Grid container item xs={11} sm={8} lg={4}>
          <Paper className={classes.paper}>
            <form onSubmit={onSubmit}>
              <Grid container direction='column' style={{ gap: 20 }}>
                <Grid container item justify='center'>
                  <Box
                    component='img'
                    height={20}
                    marginY={5}
                    src='https://ik.imagekit.io/tvlk/image/imageResource/2020/03/05/1583410755346-43c24e976f9e194b2c7023e1592c2522.png?tr=q-75'></Box>
                </Grid>

                <Grid item>
                  <Typography variant='h5'>
                    Resend verification email
                  </Typography>
                </Grid>

                <Grid container item direction='column' style={{ gap: 10 }}>
                  <Grid item>
                    <Typography
                      variant='caption'
                      style={{ fontWeight: 'bold' }}>
                      Email
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid item>
                      <TextField
                        name='email'
                        variant='outlined'
                        size='small'
                        type='email'
                        inputRef={register}
                        error={errors.email?.message.length > 0}
                        helperText={errors.email?.message}
                        disabled={loading}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container item justify='center'>
                  <Button
                    disabled={loading}
                    type='submit'
                    className={classes.btn}>
                    {loading ? 'Resending...' : 'Resend'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
