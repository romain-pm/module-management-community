import React from 'react';
import * as PropTypes from 'prop-types';
import {CheckboxGroup, CheckboxItem, CollectionBar, Input} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {BUNDLE_TYPES} from '../../utils/moduleFilters';
import styles from './Filters.scss';

// CollectionBar puts the name of the filter where its labels hold {{name}}, so i18next keeps that placeholder.
const KEEP_NAME = {name: '{{name}}', interpolation: {escapeValue: false}};

const toggleValue = (values, value, isChecked) => (isChecked ? [...values, value] : values.filter(v => v !== value));

/** The name filter stays open in the filter row, and the table follows each key the user types. */
const NameFilter = ({filters, onChange}) => {
    const {t} = useTranslation('module-management-community');
    return (
        <div className={styles.nameFilter}>
            <Input variant="search"
                   size="big"
                   value={filters.name}
                   placeholder={t('label.input.filterBySymbolicName')}
                   aria-label={t('label.filters.name')}
                   data-testid="filter-name"
                   onChange={event => onChange('name', event.target.value)}
                   onClear={() => onChange('name', '')}/>
        </div>
    );
};

/** A filter whose selector lists its options as check boxes, and whose chip names the checked options. */
const optionFilter = ({key, label, options, values, onChange}) => ({
    key,
    label,
    valueLabel: options.filter(option => values.includes(option)).join(', '),
    isDisplayedByDefault: true,
    onClear: () => onChange([]),
    selector: (
        <CheckboxGroup name={`module-filter-${key}`} aria-label={label}>
            {options.map(option => (
                <CheckboxItem key={option}
                              value={option}
                              label={option}
                              checked={values.includes(option)}
                              data-testid={`filter-${key}`}
                              {...{[`data-${key}`]: option}}
                              onChange={(_event, _value, isChecked) => onChange(toggleValue(values, option, isChecked))}/>
            ))}
        </CheckboxGroup>
    )
});

const updatesFilter = ({filters, t, onChange}) => ({
    key: 'updates',
    label: t('label.filters.updates'),
    valueLabel: filters.updatesOnly ? t('label.filters.updatesValue') : '',
    isDisplayedByDefault: true,
    onClear: () => onChange('updatesOnly', false),
    selector: (
        <CheckboxGroup name="module-filter-updates" aria-label={t('label.filters.updates')}>
            <CheckboxItem value="updatesOnly"
                          label={t('label.input.updatesOnly')}
                          checked={filters.updatesOnly}
                          data-testid="filter-updates"
                          onChange={(_event, _value, isChecked) => onChange('updatesOnly', isChecked)}/>
        </CheckboxGroup>
    )
});

/**
 * Every filter is always in the row. The Updates filter shows while an update is available or while it is applied.
 * CollectionBar has no slot for a search field, so the name filter sits before the bar.
 */
export const ModuleFilters = ({filters, states, hasUpdates, onChange}) => {
    const {t} = useTranslation('module-management-community');
    const barFilters = [
        optionFilter({
            key: 'type',
            label: t('label.filters.type'),
            options: BUNDLE_TYPES,
            values: filters.types,
            onChange: types => onChange('types', types)
        }),
        optionFilter({
            key: 'state',
            label: t('label.filters.state'),
            options: states,
            values: filters.states,
            onChange: values => onChange('states', values)
        })
    ];
    if (hasUpdates || filters.updatesOnly) {
        barFilters.push(updatesFilter({filters, t, onChange}));
    }

    return (
        <div className={styles.filters} data-testid="module-filters">
            <NameFilter filters={filters} onChange={onChange}/>
            <CollectionBar className={styles.bar}
                           filters={barFilters}
                           i18n={{
                               toolbarLabel: t('label.filters.bar'),
                               filterName: t('label.filters.chipName', KEEP_NAME),
                               clearFilter: t('label.filters.clearOne', KEEP_NAME),
                               closeButton: t('label.close')
                           }}/>
        </div>
    );
};

const filtersShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    updatesOnly: PropTypes.bool.isRequired
});

NameFilter.propTypes = {
    filters: filtersShape.isRequired,
    onChange: PropTypes.func.isRequired
};

ModuleFilters.propTypes = {
    filters: filtersShape.isRequired,
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    hasUpdates: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};
