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

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromPromisedArray,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import {
  Todo,
  User,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo,
  Conn,
  Order,
  Parcel,
  Logistic,
  getAllOrders,
  getFastSLowByDays,
  getFast,
  getFilterParcels,
  getAllLogistics,
  getAllParcels,
  getAmountByStatus,
  getOrderById,
  getLogisticDeliveryTime,
} from './database';


const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Todo') {
      return getTodo(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    // else if (type === 'Order'){
    //   return getOrder(id);
    // } else if (type === 'Parcle'){
    //   return getParcle(id);
    // } else if (type === 'Logistic'){
    //   return getLogistic(id);
    // }
    return null;
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    } else if(obj instanceof Order) {
      return GraphQLOrder;
    } else if(obj instanceof Parcel) {
      return GraphQLParcel;
    } else if(obj instanceof Logistic) {
      return GraphQLLogistic;
    }
    return null;
  }
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.complete,
    },
  },
  interfaces: [nodeInterface],
});



const { connectionType: TodosConnection, edgeType: GraphQLTodoEdge } =
  connectionDefinitions({ name: 'Todo', nodeType: GraphQLTodo });


const GraphQLOrder = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: globalIdField('Order'),
    status: {
      type: GraphQLString,
      resolve: (obj) => obj.status,
    },
    invoice_number: {
      type: GraphQLString,
      resolve: (obj) => obj.invoice_number,
    },
    invoice_date: {
      type: GraphQLString,
      resolve: (obj) => obj.invoice_date,
    },
    billing_firstname: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_firstname,
    },
    billing_lastname: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_lastname,
    },
    billing_email: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_email,
    },
    billing_phone: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_phone,
    },
    billing_street: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_street,
    },
    billing_suburb: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_suburb,
    },
    billing_postcode: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_postcode,
    },
    billing_state: {
      type: GraphQLString,
      resolve: (obj) => obj.billing_state,
    },
    grand_total: {
      type: GraphQLString,
      resolve: (obj) => obj.grand_total,
    },
    shipping_amount: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_amount,
    },
    created_at: {
      type: GraphQLString,
      resolve: (obj) => obj.created_at,
    },
    updated_at:{
      type:GraphQLString,
      resolve: (obj) => obj.updated_at,
    },
    parcels: {
      args: connectionArgs,
      type: ParcelsConnection,
      resolve: (obj, ...args) => connectionFromPromisedArray(obj.getParcels(), args),
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: OrdersConnection, edgeType: GraphQLOrderEdge } =
  connectionDefinitions({ name: 'Order', nodeType: GraphQLOrder });

const GraphQLParcel = new GraphQLObjectType({
  name: 'Parcel',
  fields: () => ({
    id: globalIdField('Parcel'),
    status: {
      type: GraphQLString,
      resolve: (obj) => obj.status,
    },
    tracking_number: {
      type: GraphQLString,
      resolve: (obj) => obj.tracking_number,
    },
    delivery_time: {
      type: GraphQLString,
      resolve: (obj) => obj.delivery_time,
    },
    dispatch_time: {
      type: GraphQLString,
      resolve: (obj) => obj.dispatch_time,
    },
    packing_time: {
      type: GraphQLString,
      resolve: (obj) => obj.packing_time,
    },
    created_datetime: {
      type: GraphQLString,
      resolve: (obj) => obj.created_datetime,
    },
    carrier: {
      type: GraphQLString,
      resolve: (obj) => obj.carrier,
    },
    logistic: {
      type: GraphQLLogistic,
      resolve: (obj) => obj.getLogistic(),
    },
    order: {
      type: GraphQLOrder,
      resolve: (obj) => obj.getOrder(),
    },
    packed_by: {
      type: GraphQLString,
      resolve: (obj) => obj.packed_by,
    },
    shipping_firstname: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_firstname,
    },
    shipping_lastname: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_lastname,
    },
    shipping_email: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_email,
    },
    shipping_phone: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_phone,
    },
    shipping_street: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_street,
    },
    shipping_suburb: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_suburb,
    },
    shipping_postcode: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_postcode,
    },
    shipping_state: {
      type: GraphQLString,
      resolve: (obj) => obj.shipping_state,
    },
    created_at: {
      type: GraphQLString,
      resolve: (obj) => obj.created_at,
    },
    updated_at: {
      type: GraphQLString,
      resolve: (obj) => obj.updated_at,
    }
  }),
  interfaces: [nodeInterface],
});

const { connectionType: ParcelsConnection, edgeType: GraphQLParcelEdge } =
  connectionDefinitions({ name: 'Parcel', nodeType: GraphQLParcel });

const GraphQLLogistic = new GraphQLObjectType({
  name: 'Logistic',
  fields: () => ({
    id: globalIdField('Logistic'),
    name: {
      type: GraphQLString,
      resolve: (obj) => obj.name,
    },
    parcels: {
      args: connectionArgs,
      type: ParcelsConnection,
      resolve: (obj, ...args) => connectionFromPromisedArray(obj.getParcels(), args),
    },
    filterparcels: {
      type: ParcelsConnection,
      args: {
        days: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        fromDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        toDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {days,fromDate,toDate, ...args}) =>
        connectionFromPromisedArray(getFilterParcels(days,fromDate,toDate), args)
    },
    lessTwo: {
      type: GraphQLInt,
      resolve: (obj) => getLogisticDeliveryTime(2, obj.id),
    },
    ThreeToFive: {
      type: GraphQLInt,
      resolve: (obj) => getLogisticDeliveryTime(3, obj.id),
    },
    fiveMore: {
      type: GraphQLInt,
      resolve: (obj) => getLogisticDeliveryTime(5, obj.id),
    },
  }),
  interfaces: [nodeInterface],
});

const { connectionType: LogisticsConnection, edgeType: GraphQLLogisticEdge } =
  connectionDefinitions({ name: 'Logistic', nodeType: GraphQLLogistic });

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),

    orders: {
      type: OrdersConnection,
      args: {
        invoiceNumber: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        invoiceDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        fromDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        toDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {invoiceNumber,invoiceDate,status,fromDate,toDate, ...args}) =>
        connectionFromPromisedArray(getAllOrders(invoiceNumber,invoiceDate,status,fromDate,toDate,), args)
    },

    speedByDays: {
      type: OrdersConnection,
      args: {
        speed: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        fromDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        toDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },

        ...connectionArgs,
      },
      resolve: (obj, { speed,fromDate,toDate,...args}) =>
        connectionFromPromisedArray(getFastSLowByDays(speed,fromDate,toDate), args)
    },

    parcels: {
      type: ParcelsConnection,
      args: {
        trackingNumber: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        createdAt: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        deliveryTime: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        logisticId: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {trackingNumber,createdAt,deliveryTime,logisticId, ...args}) =>
        connectionFromPromisedArray(getAllParcels(trackingNumber,createdAt,deliveryTime,logisticId), args)
    },

    logistics: {
      type: LogisticsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, { ...args}) =>
        connectionFromPromisedArray(getAllLogistics(), args)
    },

    todos: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, {status, ...args}) =>
        connectionFromArray(getTodos(status), args),
    },
    fastCount: {
      type: GraphQLInt,
      args: {
        fromDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        toDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, { fromDate,toDate, ...args}) => getFast('fastest', fromDate, toDate)
    },
    slowCount: {
      type: GraphQLInt,
      args: {
        fromDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        toDate: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: (obj, { fromDate, toDate, ...args}) => getFast('slowest', fromDate, toDate)
    },

    totalCount: {
      type: GraphQLInt,
      resolve: () => getTodos().length,
    },
    completedCount: {
      type: GraphQLInt,
      resolve: () => getTodos('completed').length,
    },
    ordersAmount: {
      type: GraphQLInt,
      resolve: () => getAmountByStatus(),
    },
    processingOrdersAmount: {
      type: GraphQLInt,
      resolve: () => getAmountByStatus(1),
    },
    deliveryOrdersAmount: {
      type: GraphQLInt,
      resolve: () => getAmountByStatus(2),
    },
    deliveredOrdersAmount: {
      type: GraphQLInt,
      resolve: () => getAmountByStatus(3),
    },
  },
  interfaces: [nodeInterface],
});

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  node: nodeField,
  },
});

const GraphQLAddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({localTodoId}) => {
        const todo = getTodo(localTodoId);
        return {
          cursor: cursorForObjectInConnection(getTodos(), todo),
          node: todo,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text}) => {
    const localTodoId = addTodo(text);
    return {localTodoId};
  },
});

const GraphQLChangeTodoStatusMutation = mutationWithClientMutationId({
  name: 'ChangeTodoStatus',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId),
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id, complete}) => {
    const localTodoId = fromGlobalId(id).id;
    changeTodoStatus(localTodoId, complete);
    return {localTodoId};
  },
});

const GraphQLMarkAllTodosMutation = mutationWithClientMutationId({
  name: 'MarkAllTodos',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: ({changedTodoLocalIds}) => changedTodoLocalIds.map(getTodo),
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({complete}) => {
    const changedTodoLocalIds = markAllTodos(complete);
    return {changedTodoLocalIds};
  },
});

// TODO: Support plural deletes
const GraphQLRemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedTodos',
  outputFields: {
    deletedTodoIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedTodoIds}) => deletedTodoIds,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: () => {
    const deletedTodoLocalIds = removeCompletedTodos();
    const deletedTodoIds = deletedTodoLocalIds.map(toGlobalId.bind(null, 'Todo'));
    return {deletedTodoIds};
  },
});

const GraphQLRemoveTodoMutation = mutationWithClientMutationId({
  name: 'RemoveTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedTodoId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localTodoId = fromGlobalId(id).id;
    removeTodo(localTodoId);
    return {id};
  },
});

const GraphQLRenameTodoMutation = mutationWithClientMutationId({
  name: 'RenameTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localTodoId = fromGlobalId(id).id;
    renameTodo(localTodoId, text);
    return {localTodoId};
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
    changeTodoStatus: GraphQLChangeTodoStatusMutation,
    markAllTodos: GraphQLMarkAllTodosMutation,
    removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
    removeTodo: GraphQLRemoveTodoMutation,
    renameTodo: GraphQLRenameTodoMutation,
  },
});


export const schema = new GraphQLSchema({

  query: Root,
  mutation: Mutation,
});
