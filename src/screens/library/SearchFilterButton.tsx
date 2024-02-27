import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, CheckBox, Divider, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { Category, CategoryType } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import CustomBackdrop from '../../components/common/CustomBackdrop';
import {
  BOTTOM_SNAP_POINTS_SEARCH_FILTER,
  PRIMARY_COLOR,
} from '../../config/constants/constants';
import { useCategoriesTranslation } from '../../config/i18n';
import { useQueryClient } from '../../context/QueryClientContext';
import { bottomSheetModalStyles } from '../../utils/styles';

type Props = {
  currentSelection: Category['id'][][];
  onSave: (arg: Category['id'][][]) => void;
};

const EMPTY_SELECTED_CATEGORIES = Array.from(
  { length: Object.values(CategoryType).length },
  () => [],
);

const SearchFilterButton = ({ currentSelection, onSave }: Props) => {
  const { t } = useTranslation();
  const { t: translateCategories } = useCategoriesTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { hooks } = useQueryClient();
  const { data: categories } = hooks.useCategories();
  const [selectedCategories, setSelectedCategories] = useState<
    Category['id'][][]
  >(EMPTY_SELECTED_CATEGORIES);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  const onSavePress = () => {
    onSave(selectedCategories);
    bottomSheetModalRef.current?.close();
  };

  const onClearPress = () => {
    setSelectedCategories(EMPTY_SELECTED_CATEGORIES);
  };

  const onCategoryPress = (
    categoryTypeIdx: number,
    categoryId: Category['id'],
  ) => {
    const selectionForCategoryType = selectedCategories[categoryTypeIdx];
    const idx = selectionForCategoryType.indexOf(categoryId);
    // remove or add category for category type
    const changes =
      idx >= 0
        ? selectionForCategoryType
            .slice(0, idx)
            .concat(
              selectionForCategoryType.slice(
                idx + 1,
                selectionForCategoryType.length,
              ),
            )
        : selectionForCategoryType.concat([categoryId]);
    // apply changes
    setSelectedCategories(
      selectedCategories
        .slice(0, categoryTypeIdx)
        .concat([changes])
        .concat(
          selectedCategories.slice(
            categoryTypeIdx + 1,
            selectedCategories.length,
          ),
        ),
    );
  };

  // sort by translated name
  const sortedCategoryTypes = Object.values(CategoryType)?.sort((c1, c2) =>
    translateCategories(c1).localeCompare(translateCategories(c2)),
  );

  return (
    <>
      <Button
        type="clear"
        style={{ alignSelf: 'flex-start' }}
        titleStyle={{ fontSize: 16 }}
        title={t('FILTERS_NB', { nb: currentSelection.flat().length })}
        onPress={handlePresentModalPress}
      />
      <Divider />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        style={bottomSheetModalStyles.bottomSheetModal}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_SEARCH_FILTER}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() => bottomSheetModalRef.current?.close()}
          />
        )}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              backgroundColor: 'white',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button title={t('Clear')} type="clear" onPress={onClearPress} />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {t('Filters')}
              </Text>
              <Button
                title={t('Apply')}
                type="clear"
                onPress={onSavePress}
                disabled={
                  JSON.stringify(currentSelection) ===
                  JSON.stringify(selectedCategories)
                }
              />
            </View>
            <Divider style={{ marginBottom: 16 }} />
            {sortedCategoryTypes.map((ct, idx) => {
              const sortedCategories = categories?.filter(
                ({ type }) => type === ct,
              );
              // sort by translated name
              sortedCategories?.sort((c1, c2) =>
                translateCategories(c1.name).localeCompare(
                  translateCategories(c2.name),
                ),
              );

              return (
                <>
                  <Text style={{ fontSize: 16 }}>
                    {translateCategories(ct)}
                  </Text>
                  {sortedCategories?.map((c) => (
                    <CheckBox
                      checked={selectedCategories[idx].includes(c.id)}
                      title={translateCategories(c.name)}
                      containerStyle={{
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        padding: 0,
                      }}
                      onPress={() => onCategoryPress(idx, c.id)}
                      iconType="material-community"
                      checkedIcon="checkbox-marked"
                      uncheckedIcon="checkbox-blank-outline"
                      checkedColor={PRIMARY_COLOR}
                    />
                  ))}
                  <Divider style={{ marginVertical: 15 }} />
                </>
              );
            })}
          </View>
        </ScrollView>
      </BottomSheetModal>
    </>
  );
};

export default SearchFilterButton;
