/**
 *
 * Header
 *
 */
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  hooks,
  metaMask,
  connectMetamask,
  disconnectMetamask,
  useBalance,
  tokenSymbol,
} from 'utils/metamask';

const { useAccounts, useIsActive, useProvider } = hooks;

export function Header() {
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const balance = useBalance(provider, accounts);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            $Quiz
          </Typography>
          <Button
            onClick={() =>
              isActive
                ? disconnectMetamask(metaMask)
                : connectMetamask(metaMask)
            }
            color="inherit"
          >
            {isActive ? `${tokenSymbol} - ${balance} ` : 'Connect'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
