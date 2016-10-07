/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {IndexLink, Link} from 'react-router';
import RemoveCompletedTodosMutation from '../mutations/RemoveCompletedTodosMutation';

import React from 'react';
import Relay from 'react-relay';

class TodoListFooter extends React.Component {
  _handleRemoveCompletedTodosClick = () => {
    this.props.relay.commitUpdate(
      new RemoveCompletedTodosMutation({
        todos: this.props.viewer.todos,
        viewer: this.props.viewer,
      })
    );
  };
  render() {
    const numCompletedTodos = this.props.viewer.completedCount;
    const numRemainingTodos = this.props.viewer.totalCount - numCompletedTodos;
    return (
      <footer className="footer">
        <ul className="filters">
          <li>
            <IndexLink to="/" activeClassName="selected">Home</IndexLink>
          </li>
          <li>
            <Link to="/allOrders" activeClassName="selected">Orders</Link>
          </li>
          <li>
            <Link to="/parcels" activeClassName="selected">Parcels</Link>
          </li>
          <li>
            <Link to="/logistics" activeClassName="selected">Logistics</Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default Relay.createContainer(TodoListFooter, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        completedCount,
        todos(
          status: "completed",
          first: 2147483647  # max GraphQLInt
        ) {
          ${RemoveCompletedTodosMutation.getFragment('todos')},
        },
        totalCount,
        ${RemoveCompletedTodosMutation.getFragment('viewer')},
      }
    `,
  },
});
