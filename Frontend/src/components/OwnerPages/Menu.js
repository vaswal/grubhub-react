import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import Popup from "reactjs-popup";
import uuid from "uuid";
import "../../styles/Menu.css"
import {HOSTNAME} from "../../components/Constants/Constants";
import {Redirect} from 'react-router';
import axios from 'axios';

axios.defaults.withCredentials = true;

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            currentTab: {},
            allItems: [],
            allSections: [],
            editMode: false,
            editTabNameMode: false,
            addItemSuccess: null,
            updateItemSuccess: null,
            file: '',
            imagePreviewUrl: ''
        };

        this.addMenuItem = this.addMenuItem.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this.getMenuItems = this.getMenuItems.bind(this);
        this.addItemTriggerButton = this.addItemTriggerButton.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    render() {
        return (<h1>Menu</h1>);
    }

    handleDoubleClick = () => {
        this.setState({
            editTabNameMode: true
        });
    };

    handleEditTabName = e => {
        const {currentTab, tabs} = this.state;

        const updatedTabs = tabs.map(tab => {
            if (tab.id === currentTab.id) {
                return {
                    ...tab,
                    name: e.target.value
                };
            } else {
                return tab;
            }
        });

        this.setState({
            tabs: updatedTabs,
            currentTab: {
                ...currentTab,
                name: e.target.value
            }
        });
    };

    handleOnBlur = () => {
        this.setState({
            editTabNameMode: false
        });
    };

    createTabs = () => {
        const {tabs, currentTab, editTabNameMode} = this.state;

        const allTabs = tabs.map(tab => {
            return (
                <li>
                    {editTabNameMode && currentTab.id === tab.id ? (
                        <input
                            value={tab.name}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleEditTabName}
                        />
                    ) : (
                        <button
                            className={currentTab.id === tab.id ? "tab active" : "tab"}
                            onClick={() => this.handleSelectTab(tab)}
                            onDoubleClick={() => this.handleDoubleClick(tab)}
                        >
                            {tab.name}
                        </button>
                    )}
                </li>
            );
        });

        return <ul className="nav nav-tabs">{allTabs}</ul>;
    };

    handleSelectTab = tab => {
        this.setState({
            currentTab: tab,
            editMode: false,
            editTabNameMode: false
        });
    };

    handleAddTab = () => {
        const {tabs} = this.state;

        const newTabObject = {
            id: uuid(),
            name: `Section ${tabs.length + 1}`,
            content: ``
        };

        this.setState({
            tabs: [...tabs, newTabObject],
            currentTab: newTabObject,
            editMode: false,
            editTabNameMode: false
        });
    };

    handleDeleteTab = tabToDelete => {
        const {tabs} = this.state;
        const tabToDeleteIndex = tabs.findIndex(tab => tab.id === tabToDelete.id);

        const updatedTabs = tabs.filter((tab, index) => {
            return index !== tabToDeleteIndex;
        });

        const previousTab =
            tabs[tabToDeleteIndex - 1] || tabs[tabToDeleteIndex + 1] || {};

        this.setState({
            tabs: updatedTabs,
            editMode: false,
            editTabNameMode: false,
            currentTab: previousTab
        });

        const payload = {};
        payload.queryName = "DELETE_SECTION";
        payload.arguments = [this.state.currentTab.name, localStorage.getItem('userId')];

        axios.post(`http://${HOSTNAME}:3001/orders/update`, payload)
            .then((response) => {

            });
    };

    setEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
        });
    };

    done = () => {
        const payload = {};
        payload.name = this.state.currentTab.name;
        payload.owner_id = localStorage.getItem('_id');

        axios.post(`http://${HOSTNAME}:3001/orders/section/add`, payload)
            .then((response) => {
                this.setState({
                    editMode: !this.state.editMode
                });
                this.getMenuItems();
            });
    };

    handleContentChange = e => {
        const {tabs, currentTab} = this.state;
        this.setState({});

        const updatedTabs = tabs.map(tab => {
            if (tab.id === currentTab.id) {
                return {
                    ...tab,
                    name: e.target.value
                };
            } else {
                return tab;
            }
        });

        this.setState({
            tabs: updatedTabs,
            currentTab: {
                ...currentTab,
                name: e.target.value
            }
        });
    };

    update = () => {
        console.log("update")
    };

    delete = (menu_item_id) => {
        return e => {
            e.preventDefault();
            this.setState({updateItemSuccess: null});
            console.log(menu_item_id);

            const payload = {};
            payload.menu_item_id = menu_item_id;

            axios.post(`http://${HOSTNAME}:3001/orders/menu_item/delete`, payload)
                .then((response) => {
                    this.getMenuItems();
                });
        }
    };

    updateMenuItem = (menu_item_id) => {
        return e => {
            e.preventDefault();
            this.setState({updateItemSuccess: null});
            console.log(menu_item_id);

            const data = {};
            const itemsToBeSet = [];
            let str = "";
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].value !== "") {
                    itemsToBeSet.push(e.target[i].name + " = '" + e.target[i].value + "'");
                    data[e.target[i].name] = e.target[i].value;
                }
            }
            str = itemsToBeSet.join();
            console.log("data");
            console.log(data);
            console.log(str);

            const outerPayload = {};
            outerPayload.itemsToBeSet = itemsToBeSet;
            outerPayload.arguments = [menu_item_id];

            axios.post(`http://${HOSTNAME}:3001/orders/updateMenuItem`, outerPayload)
                .then((response) => {
                    console.log("updateMenuItem");
                    this.getMenuItems();
                })
                .catch((error) => {
                    this.setState({updateItemSuccess: false});
                });
        }
    };

    createItems = (items) => {
        const allTabs = items.map(item => {
            return (
                <li>
                    <div className="menu">
                        <form className="form" onSubmit={this.updateMenuItem(item.menu_item_id)}>
                            <div className='rowC'>
                                <div className="card-header"><img style={{width: "150px", height: "150px", margin: 0}}
                                                                  src={require(`../../images/grubhub/${item.image}`)}/>
                                </div>
                                <div style={{marginLeft: "-280px"}}>
                                    <div className="x-div">
                                        <div className='rowC'>
                                            <label className="account-labels menu-label">Name</label>
                                            <label style={{marginLeft: "-1px"}} className="account-labels menu-label"
                                                   name="name">{item.name}</label>
                                        </div>

                                        <div className='rowC'>
                                            <label className="account-labels menu-label">Modify</label>
                                            <div style={{marginLeft: "-200px"}} className="input-email">
                                                <input className="email account-input" type="input" name="name"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="email-div">
                                        <div className='rowC'>
                                            <label className="account-labels menu-label">Description</label>
                                            <label style={{marginLeft: "-1px"}} className="account-labels desc-label"
                                                   name="descriptionStored">{item.description}</label>
                                        </div>

                                        <div className='rowC'>
                                            <label className="account-labels menu-label">Modify</label>
                                            <div style={{marginLeft: "-200px"}} className="input-email">
                                                <input className="email account-input" type="input" name="description"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="email-div">
                                        <div className='rowC'>
                                            <label className="account-labels email-label">Price</label>
                                            <label style={{marginLeft: "-1px"}}
                                                   className="account-labels email-label">{item.price}</label>
                                        </div>

                                        <div className='rowC'>
                                            <label className="account-labels email-label">Modify</label>
                                            <div style={{marginLeft: "-200px"}} className="input-email">
                                                <input className="email account-input" type="input" name="price"/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div style={{marginLeft: "250px"}} className='rowC'>
                                <Button type="submit" variant="primary" className="menu-btn">Update</Button>
                                <Button style={{marginLeft: "60px"}} type="button" variant="primary"
                                        className="menu-btn"
                                        onClick={this.delete(item._id)}>Delete</Button>
                            </div>
                            <div>
                            </div>
                        </form>
                    </div>

                </li>
            );
        });

        return <ul className="ul li">{allTabs}</ul>;
    };

    addItemTriggerButton() {
        console.log("Inside addItemTriggerButton");
        this.setState({addItemSuccess: null});
        this.setState({updateItemSuccess: null});
    }

    addMenuItem = (e) => {
        e.preventDefault();
        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            data[e.target[i].name] = e.target[i].value;
        }

        const outerPayload = {};
        outerPayload.queryName = "ADD_MENU_ITEM";
        outerPayload.arguments = [uuid(), data.name, data.description, data.price, data.image, this.state.currentTab.name, localStorage.getItem('userId')];

        const form = new FormData();
        console.log("filename");
        console.log(this.state.file.name);
        const extension = this.state.file.name.split(".")[1];

        const fileName = uuid();

        form.append('menu_item_id', uuid());
        form.append('name', data.name);
        form.append('description', data.description);
        form.append('price', data.price);
        form.append('image', fileName + "." + extension);
        form.append('section', this.state.currentTab.name);
        form.append('owner_id', localStorage.getItem('_id'));
        form.append('file', this.state.file, (fileName + "." + extension));

        axios.post(`http://${HOSTNAME}:3001/orders/menu_item/add`, form)
            .then((response) => {
                console.log("addMenuItem");
                console.log(response);
                this.setState({addItemSuccess: true});
                this.getMenuItems();

            })
            .catch((error) => {
                this.setState({addItemSuccess: false});
            });
    };

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file)
    }

    getMenuItems() {
        console.log("getMenuItems");
        const outerPayload = {};
        outerPayload.owner_id = localStorage.getItem('_id');

        axios.post(`http://${HOSTNAME}:3001/orders/section/get`, outerPayload)
            .then((response) => {
                const set = new Set();
                console.log(response.data);
                for (const section of response.data) {
                    set.add(section.name);
                }
                this.setState({allSections: set});

                const tabSkeleton = [];
                let count = 1;
                for (const section of this.state.allSections) {
                    tabSkeleton.push({id: count, name: section, content: null});
                    count = count + 1;
                }
                this.setState({tabs: tabSkeleton});

                const payload = {};
                payload.owner_id = [localStorage.getItem('_id')];


                axios.post(`http://${HOSTNAME}:3001/orders/menu_item/get`, payload)
                    .then((response) => {
                        this.setState({allItems: response.data});

                        for (const section of this.state.allSections) {
                            const index = this.state.tabs.findIndex(obj => obj.name === section);
                            const updatedTabs = this.state.tabs;
                            const items = this.state.allItems.filter(item => {
                                    return (item.section === section)
                                }
                            );

                            console.log("items");
                            console.log(items);

                            updatedTabs[index].content = <div>
                                <div>
                                    <Popup closeOnDocumentClick
                                           onOpen={console.log("Opening")}
                                           onClose={console.log("Closing")}
                                           trigger={open => (
                                               <button className="button" type="submit"
                                                       onClick={this.addItemTriggerButton()}>Add item</button>
                                           )}
                                           position="right center">
                                        <div>
                                            <form className="form" onSubmit={this.addMenuItem}>
                                                <div className="x-div">
                                                    <div className='rowC'>
                                                        <label>Name</label>
                                                        <div><input type="input" name="name" required/></div>
                                                    </div>

                                                    <div className='rowC'>
                                                        <label>Description</label>
                                                        <div><input type="input" name="description" required/></div>
                                                    </div>

                                                    <div className='rowC'>
                                                        <label>Price</label>
                                                        <div><input type="input" name="price" required/></div>
                                                    </div>

                                                    <div className='rowC'>
                                                        <label>Image</label>
                                                        <input type="file" onChange={this._handleImageChange}/>
                                                    </div>
                                                </div>


                                                <div>
                                                    <button type="submit">Add</button>
                                                </div>

                                                <div className='rowC'>
                                                    <br/>
                                                    <br/>
                                                    <br/>

                                                </div>
                                            </form>
                                        </div>
                                    </Popup>
                                </div>
                                <div>{this.createItems(items)}</div>
                            </div>;
                            this.setState({tabs: updatedTabs, currentTab: updatedTabs[index]});
                        }
                    });
            });
    }

    componentWillMount() {
        if (localStorage.getItem('userType') !== null) {
            this.getMenuItems();
        }
    }

    render() {
        const redirectVar = (localStorage.getItem('userType') === null) ? <Redirect to="/home"/> : null;

        const {currentTab, editMode} = this.state;

        return (
            <div>
                {/*{redirectVar}*/}
                <div className="container">

                    <div className="well">
                        <button className="add-tab-button" onClick={this.handleAddTab}>
                            <i className="text-primary fas fa-plus-square"/> Add Section
                        </button>

                        {this.createTabs()}
                        {(this.state.updateItemSuccess != null) && this.state.updateItemSuccess === false &&
                        <div className="unsuccess-signup"><span>Sorry, could not update item</span></div>}
                        {(this.state.addItemSuccess != null) && this.state.addItemSuccess === false &&
                        <div className="unsuccess-signup"><span>Sorry, could not add item</span></div>}
                        {(this.state.addItemSuccess != null) && this.state.addItemSuccess === true &&
                        <div className="success-signup"><span>Successfully added item</span></div>}


                        <h3>{this.state.currentTab.name}</h3>
                        <div className="tab-content">
                            {editMode ? (
                                <div>
                                <textarea
                                    onChange={this.handleContentChange}
                                    value={this.state.currentTab.name}
                                />
                                    <button className="save-button" onClick={this.done}>
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {currentTab.content}
                                    {currentTab.id ? (
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <button
                                                className="edit-mode-button"
                                                onClick={this.setEditMode}
                                            >
                                                Edit Section Name
                                            </button>
                                            <button onClick={() => this.handleDeleteTab(currentTab)}>
                                                Delete section
                                            </button>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;