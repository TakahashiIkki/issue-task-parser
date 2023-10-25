/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */
const core = require('@actions/core');
const main = require('../src/main');

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation();
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();

// Mock the action's main function
const runMock = jest.spyOn(main, 'run');

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets the time output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'owner':
          return 'TakahashiIkki';
        case 'repo':
          return 'issue-task-parser';
        case 'issue_number':
          return 50;
        default:
          return '';
      }
    });

    await main.run();
    expect(runMock).toHaveReturned();

    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'time', [
      {
        owner: 'TakahashiIkki',
        repo: 'issue-task-parser',
        issueNumber: 50
      }
    ]);
  });

  describe('failed when required parameter', () => {
    it('fails when owner is not provided', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'owner':
            throw new Error('Input required and not supplied: owner');
          case 'repo':
            return 'issue-task-parser';
          case 'issue_number':
            return 50;
          default:
            return '';
        }
      });

      await main.run();
      expect(runMock).toHaveReturned();

      // Verify that all of the core library functions were called correctly
      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'Input required and not supplied: owner'
      );
    });
    it('fails when repo is not provided', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'owner':
            return 'TakahashiIkki';
          case 'repo':
            throw new Error('Input required and not supplied: repo');
          case 'issue_number':
            return 50;
          default:
            return '';
        }
      });

      await main.run();
      expect(runMock).toHaveReturned();

      // Verify that all of the core library functions were called correctly
      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'Input required and not supplied: repo'
      );
    });
    it('fails when issue_number is not provided', async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation(name => {
        switch (name) {
          case 'owner':
            return 'TakahashiIkki';
          case 'repo':
            return 'issue-task-parser';
          case 'issue_number':
            throw new Error('Input required and not supplied: issue_number');
          default:
            return '';
        }
      });

      await main.run();
      expect(runMock).toHaveReturned();

      // Verify that all of the core library functions were called correctly
      expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        'Input required and not supplied: issue_number'
      );
    });
  });
});
