import { Container, Stack } from '@mui/material';
import { useState } from 'react';
import Header from './HeroContent/Header';
import { COLORS, SAMPLE_DATA } from './constants';
import StyledAppBar from './HeroContent/StyledAppBar';
import Signup from './Authentication/Signup/Signup';
import Login from './Authentication/Login/Login';
import FloatingBarChart from '@common/Chart/FloatingBarChart';
import SimpleModal from '@common/SimpleModal/SimpleModal';

export default function LandingPage() {
  const [currentForm, setCurrentForm] = useState('');
  const [displayModal, setDisplayModal] = useState(false);

  const openDisplayModal = () => setDisplayModal(true);
  const closeDisplayModal = () => setDisplayModal(false);

  const openSignupModal = () => {
    openDisplayModal();
    setCurrentForm('signup');
  };

  const openLoginModal = () => {
    openDisplayModal();
    setCurrentForm('signin');
  };

  const formattedData = SAMPLE_DATA.map((v, index) => ({
    label: v.name,
    start: index === 0 ? 0 : SAMPLE_DATA[index - 1].price,
    end: v.price,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <>
      <StyledAppBar elevation={0} />
      <Container maxWidth="md">
        <Stack spacing={2}>
          <Header openSignupModal={openSignupModal} openLoginModal={openLoginModal} />
          <FloatingBarChart
            data={formattedData}
            backgroundColor={formattedData.map((d) => d.color)}
            borderColor={formattedData.map((d) => d.color)}
          />
        </Stack>
      </Container>
      {displayModal && (
        <SimpleModal
          title={currentForm === 'signin' ? 'Sign In' : 'Sign Up'}
          subtitle={
            currentForm === 'signin'
              ? 'Login to manage your account.'
              : 'Keep an account to keep track of all your inventories.'
          }
          handleClose={closeDisplayModal}
          maxSize="xs"
        >
          {currentForm === 'signup' ? <Signup handleClose={closeDisplayModal} /> : <Login />}
        </SimpleModal>
      )}
    </>
  );
}
