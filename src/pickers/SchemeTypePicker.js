import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { fetchClaimOfficers,fetchSchemeType } from "../actions";
import { formatMessage, AutoSuggestion, ProgressOrError, withModulesManager, decodeId } from "@openimis/fe-core";
import { FormControl } from "@material-ui/core";

const styles = theme => ({
    label: {
        color: theme.palette.primary.main
    }
});

class SchemeTypePicker  extends Component {

    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-claim", "SchemeTypePicker.selectThreshold", 10);
    }

    componentDidMount() {
        if (!this.props.fetchedClaimSsf) {
            // prevent loading multiple times the cache when component is
            // several times on tha page
            setTimeout(
                () => {
                    !this.props.fetchingClaimSsf && this.props.fetchSchemeType(this.props.modulesManager)
                },
                Math.floor(Math.random() * 300)
            );
        }
    }

    formatSuggestion = a => !a ? "" : `${a.SCHNameEng} `;

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const {
            intl, value, reset, claimSsf,
            fetchingClaimSsf, fetchedClaimSsf, errorClaimSsf,
            withLabel = true, label, readOnly = false, required = false,
            withNull = true, nullLabel = null,
        } = this.props;
        let v = claimSsf ? claimSsf.filter(o => parseInt(decodeId(o.id)) === value) : [];
        v = v.length ? v[0] : null;
        return (
            <Fragment>
                <ProgressOrError progress={fetchingClaimSsf} error={errorClaimSsf} />
                {fetchedClaimSsf && (
                    <AutoSuggestion
                        module="claim"
                        items={claimSsf}
                        label={!!withLabel && (label || formatMessage(intl, "claim", "SchemeTypePicker.label"))}
                        getSuggestions={this.claimSsf}
                        getSuggestionValue={this.formatSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        value={v}
                        reset={reset}
                        readOnly={readOnly}
                        required={required}
                        selectThreshold={this.selectThreshold}
                        withNull={withNull}
                        nullLabel={nullLabel || formatMessage(intl, "claim", "claim.SchemeTypePicker.null")}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    claimSsf: state.claim.claimSsf,
    fetchingClaimSsf: state.claim.fetchingClaimSsf,
    fetchedClaimSsf: state.claim.fetchedClaimSsf,
    errorClaimSsf: state.claim.errorClaimSsf,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchSchemeType }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(SchemeTypePicker))))
);
