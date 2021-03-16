import path from 'path';

import React from 'react';
import { Polly } from '@pollyjs/core';
import NodeHttpAdapter from '@pollyjs/adapter-node-http';
import FsPersister from '@pollyjs/persister-fs';
import { setupPolly } from 'setup-polly-jest';
import fetch from 'node-fetch';
import { fireEvent, render, waitFor } from '@testing-library/react';

import repos from '../../mock/repositories';
import GraphsView from '../../../../ui/perfherder/graphs/GraphsView';

const frameworks = [
  { id: 1, name: 'talos' },
  { id: 2, name: 'build_metrics' },
];
const location = {
  search:
    '?timerange=7776000&series=mozilla-beta,2881572,1,1&series=autoland,85d066e5f8cedddfc50f1e2f935264ec1dc07e30,1,1',
};

const graphsView = () => {
  return render(
    <GraphsView frameworks={frameworks} location={location} projects={repos} />,
  );
};

Polly.register(NodeHttpAdapter);
Polly.register(FsPersister);

describe('GraphsViewRecord Test', () => {
  const context = setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, 'recordings'),
      },
    },
  });

  test('should be able to record', async () => {
    context.polly.configure({ recordIfMissing: true });

    const response = await fetch(
      'http://localhost:5000/api/changelog/?startdate=2021-02-17',
    );

    expect(response).not.toBeNull();
  });

  test('record graphs view requests', async () => {
    context.polly.configure({ recordIfMissing: true });
    const { getByText } = graphsView();
    const button = await waitFor(() =>
      getByText('tp5o opt e10s stylo webrender-sw'),
    );
    fireEvent.click(button);
    const modal = await waitFor(() => getByText('Add Test Data'));

    expect(modal).toBeNull();
  });
});
