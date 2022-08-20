import { Button, Center, Checkbox, createStyles, Group, Modal, NumberInput, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { z } from 'zod';

const useStyles = createStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
  },
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
    paddingBlock: 56,
    paddingInline: 48,
    width: '100%',
    maxWidth: 540,

    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
    },
  },

  title: {
    marginBlockEnd: theme.spacing.md,
    fontSize: theme.fontSizes.sm * 2,
  },

  modalContent: {
    paddingBlock: theme.spacing.md,
  },

  focusedText: {
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },

  blockText: {
    display: 'block',
  },
}));

const isEthAddress = (addr: string) => {
  return ethers.utils.isAddress(addr);
};

const transactionSchema = z.object({
  ethAddress: z.string().refine(isEthAddress, (val) => ({
    message: `${val.slice(0, 6)}...${val.slice(-4)} is not a valid Ethereum address`,
  })),
  amount: z
    .string()
    .regex(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)
    .transform(Number),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{1,6}$/, 'OTP must be 6 digits'),
});

const Home = () => {
  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(false);

  // Assuming that the OTP is a 6 digit number
  const form = useForm({
    initialValues: {
      ethAddress: '',
      amount: '',
      otp: '',
    },
    validate: zodResolver(transactionSchema),
  });

  return (
    <Center className={classes.root}>
      <Modal centered size="md" radius="md" shadow="lg" opened={opened} onClose={() => setOpened(false)} title="Transaction Confirmation" withCloseButton={false}>
        {/* Modal content */}
        <div className={classes.modalContent}>
          <Text>
            You are transferring{' '}
            <Text component="span" color="red" className={classes.focusedText}>
              {form.values.amount}
            </Text>{' '}
            ETH to{' '}
            <Text component="span" color="red" className={cx(classes.focusedText, classes.blockText)}>
              {form.values.ethAddress}
            </Text>
            . Are You Sure?
          </Text>
        </div>

        <Group mt="xl">
          <Button color="indigo" onClick={() => setOpened(false)}>
            Confirm
          </Button>
          <Button variant="outline" color="indigo" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <Paper radius="md" shadow="xl" className={classes.card}>
        <Title className={classes.title} order={2}>
          Send ETH to address
        </Title>
        <form
          onSubmit={form.onSubmit(() => {
            setOpened(true);
          })}
        >
          <Stack spacing={24}>
            <TextInput size="md" required label="ETH Address" value={form.values.ethAddress} onChange={(event) => form.setFieldValue('ethAddress', event.currentTarget.value)} error={form.errors.ethAddress} />

            <TextInput
              size="md"
              required
              label="Amount of ETH to Transfer"
              value={form.values.amount}
              onChange={(event) => {
                const re = /^([0-9]{1,})?(\.)?([0-9]{1,})?$/;

                if (event.currentTarget.value === '' || event.currentTarget.value.match(re)) {
                  form.setFieldValue('amount', event.currentTarget.value);
                }
              }}
              error={form.errors.amount}
            />

            <TextInput
              size="md"
              required
              label="OTP"
              value={form.values.otp}
              onChange={(event) => {
                form.setFieldValue('otp', event.currentTarget.value.replace(/[^0-9]+/gi, ''));
              }}
              error={form.errors.otp}
            />
          </Stack>

          <Group position="apart" mt={32}>
            <Button fullWidth size="lg" color="indigo" type="submit">
              Send ETH
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
};

export default Home;
