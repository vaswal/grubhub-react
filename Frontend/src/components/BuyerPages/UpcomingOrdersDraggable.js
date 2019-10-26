import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../styles/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getOrdersByStatus, onDragEnd} from "../../js/actions/restaurantActions";

//axios.defaults.withCredentials = true;

function mapStateToProps(store) {
    return {
        items: store.restaurant.items,
        selected: store.restaurant.selected
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOrdersByStatus: (payload) => dispatch(getOrdersByStatus(payload)),
        onDragEnd: (payload) => dispatch(onDragEnd(payload))
    };
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: grid,
    width: 250
});

class UpcomingOrdersDraggable extends Component {
    constructor(props) {
        super(props);

        //this.getOrders = this.getOrders.bind(this);
        this.itemFormatter = this.itemFormatter.bind(this);
    }


    // id2List = {
    //     droppable: 'items',
    //     droppable2: 'selected'
    // };

    //getList = id => this.props[this.id2List[id]];

    // onDragEnd = result => {
    //     console.log("onDragEnd")
    //     console.log("result")
    //     console.log(result  )
    //
    //
    //     const { source, destination } = result;
    //     console.log("source")
    //     console.log(source)
    //     console.log("destination")
    //     console.log(destination)
    //
    //
    //     // dropped outside the list
    //     if (!destination) {
    //         return;
    //     }
    //
    //     if (source.droppableId === destination.droppableId) {
    //         const items = reorder(
    //             this.getList(source.droppableId),
    //             source.index,
    //             destination.index
    //         );
    //
    //         let state = { items };
    //
    //         if (source.droppableId === 'droppable2') {
    //             state = { selected: items };
    //         }
    //
    //         console.log("Intra list movement")
    //         console.log("state")
    //         console.log(state)
    //         console.log("this.getList(source.droppableId")
    //         console.log(this.getList(source.droppableId))
    //
    //         this.setState(state);
    //     } else {
    //         console.log("(source.droppableId)")
    //         console.log(source.droppableId)
    //
    //         console.log("this.getList(source.droppableId)")
    //         console.log(this.getList(source.droppableId))
    //
    //         console.log("this.getList(\"droppable\")")
    //         console.log(this.getList("droppable"))
    //
    //         const result = move(
    //             this.getList(source.droppableId),
    //             this.getList(destination.droppableId),
    //             source,
    //             destination
    //         );
    //
    //
    //
    //         this.setState({
    //             items: result.droppable,
    //             selected: result.droppable2
    //         });
    //     }
    // };

    itemFormatter = (cell, row) => {
        return cell.join(" | ")
    };

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            const payload = {};
            payload.userId = localStorage.getItem('_id');
            payload.statusSet = new Set(["New", "Preparing", "Ready"]);
            payload.statusCode = "Upcoming";

            this.props.getOrdersByStatus(payload);
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        return (
            <div>
                <div className='rowC'>
                    <DragDropContext onDragEnd={this.props.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.props.items.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <Droppable droppableId="droppable2">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    {this.props.selected.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingOrdersDraggable);