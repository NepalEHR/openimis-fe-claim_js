import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchClaimAdmins } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError } from "@openimis/fe-core";
import { FormControl } from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class ClaimAdminSelect extends Component {

    componentDidMount() {
        if (!this.props.fetchedClaimAdmins) {
            this.props.fetchClaimAdmins();
        }
    }

    formatSuggestion = a => `${a.code} ${a.lastName} ${a.otherName || ""}`;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const {
            intl, initValue, claimAdmins,
            fetchingClaimAdmins, fetchedClaimAdmins, errorClaimAdmins,
            withLabel = true, label
        } = this.props;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimAdmins} error={errorClaimAdmins} />
                {fetchedClaimAdmins && (
                    <FormControl fullWidth>
                        <AutoSuggestion
                            items={claimAdmins}
                            label={!!withLabel && (label || formatMessage(intl, "claim", "ClaimAdminSelect.label"))}
                            getSuggestions={this.claimAdmins}
                            getSuggestionValue={this.formatSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                            initValue={initValue}
                        />
                    </FormControl>
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claimAdmins: state.claim.claimAdmins,
    fetchingClaimAdmins: state.claim.fetchingClaimAdmins,
    fetchedClaimAdmins: state.claim.fetchedClaimAdmins,
    errorClaimAdmins: state.claim.errorClaimAdmins,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchClaimAdmins }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ClaimAdminSelect))));
