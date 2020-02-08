import { MockedProvider } from '@apollo/react-testing';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { engageMessageFactory } from 'modules/testing-utils/factories/engage';
import * as React from 'react';
import { create } from 'react-test-renderer';
import wait from 'waait';
import { queries } from '../../graphql';
import EmailStatistics from '../EmailStatistics';

const messageId = 'string';

const engageMessageDetailMock = {
  request: {
    query: gql(queries.engageMessageStats),
    variables: { _id: '' }
  },
  result: {
    data: {
      EngageMessageDetail: [
        engageMessageFactory.build(),
        engageMessageFactory.build({
          _id: '1'
        })
      ]
    }
  }
};

const engageMessageDetailErrorMock = {
  request: {
    query: gql(queries.engageMessageStats),
    variables: { _id: '' }
  },
  result: {
    errors: [new GraphQLError('forced error')]
  }
};

describe('EmailStatistics', () => {
  it('should render loading state initially', () => {
    const testRenderer = create(
      <MockedProvider mocks={[]}>
        <EmailStatistics messageId={messageId} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const loader = testInstance.findByProps({ objective: true }).type;

    const spinner = loader({});

    expect(spinner.props.objective).toEqual(false);
  });

  it('should show error', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageMessageDetailErrorMock]}
        addTypename={false}
      >
        <EmailStatistics messageId={messageId} />
      </MockedProvider>
    );

    const testInstance = testRenderer.root;
    const span = testInstance.findByType('span');
    expect(span.children).toContain('forced error');
  });

  it('should render content', async () => {
    const testRenderer = create(
      <MockedProvider
        mocks={[engageMessageDetailMock]}
        addTypename={false}
      >
        <EmailStatistics messageId={messageId} />
      </MockedProvider>
    );

    await wait(0); // wait for response

    const tree = testRenderer.toJSON();
    expect(tree).toBe(null);
  });
});