import { Provider } from 'cerebral';
import {
  sandboxUrl,
  dashboardUrl,
} from '@codesandbox/common/utils/url-generator';
import { getSandboxOptions } from '@codesandbox/common/url';
import history from '../../utils/history';

export default Provider({
  updateSandboxUrl(sandbox) {
    history.push(sandboxUrl(sandbox));
  },
  redirectToNewSandbox() {
    history.push('/s/new');
  },
  redirectToSandboxWizard() {
    history.replace('/s/');
  },
  redirectToDashboard() {
    history.replace(dashboardUrl());
  },
  getSandboxOptions() {
    return getSandboxOptions(decodeURIComponent(document.location.href));
  },
});