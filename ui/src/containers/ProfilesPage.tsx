import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Griddle, {RowDefinition, ColumnDefinition} from 'griddle-react';

import {bindActionCreators} from "redux";
import * as actions from '../actions/profiles';
import {RootState} from "../reducers/index";
import {RouteComponentProps} from "react-router";
import {ProfilesState} from "../reducers/profiles";
import {IndexActionRequest} from "../actions/profiles";
import {PayloadScopeIcon} from '../components/griddle/PayloadScopeIcon';

interface ReduxStateProps {
    profiles: ProfilesState;
}

interface ReduxDispatchProps {
    index: IndexActionRequest;
}

interface ProfilesPageProps extends ReduxStateProps, ReduxDispatchProps, RouteComponentProps<any> {
    componentWillMount: () => void;
}

interface ProfilesPageState {
    filter: string;
}

@connect<ReduxStateProps, ReduxDispatchProps, ProfilesPageProps>(
    (state: RootState, ownProps?: any): ReduxStateProps => {
        return { profiles: state.profiles };
    },
    (dispatch: Dispatch<any>): ReduxDispatchProps => {
        return bindActionCreators({
            index: actions.index
        }, dispatch);
    }
)
export class ProfilesPage extends React.Component<ProfilesPageProps, ProfilesPageState> {

    componentWillMount(): void {
        this.props.index();
    }

    handleFilter = (filterText: string) => {
        // TODO: debounce filter text
    };

    render(): JSX.Element {
        const {
            profiles
        } = this.props;

        const eventHandlers = {
            onFilter: this.handleFilter,
        };

        return (
            <div className='DevicesPage top-margin container'>
                <div className='row'>
                    <div className='column'>
                        <h1>Profiles</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='column'>
                        <form method='POST' action='/api/v1/profiles/upload' encType='multipart/form-data'>
                            <input type='file' name='file' accept='application/x-apple-aspen-config' />
                            <input type='submit' />
                        </form>
                    </div>
                </div>
                <div className='row'>
                    <div className='column'>
                        <Griddle
                            data={profiles.items}
                            pageProperties={{
                                currentPage: profiles.currentPage,
                                pageSize: profiles.pageSize,
                                recordCount: profiles.recordCount
                            }}
                            events={eventHandlers}
                        >
                            <RowDefinition>
                                <ColumnDefinition id="id" />
                                <ColumnDefinition title="Scope" id="attributes.scope" component={PayloadScopeIcon} />
                                <ColumnDefinition title="UUID" id="attributes.uuid" />
                                <ColumnDefinition title="Name" id="attributes.display_name" />
                            </RowDefinition>
                        </Griddle>
                    </div>
                </div>
            </div>
        );
    }
}