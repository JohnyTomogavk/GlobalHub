import { FormInstance } from 'antd';
import { useEffect } from 'react';
import { useWatch } from 'antd/lib/form/Form';
import { TagDto } from '../../dto/budgetTags/tagDto';

const useNewTagFormWatcher = <TFormModel>(
  formInstance: FormInstance<TFormModel>,
  tagFieldName: keyof TFormModel,
  createNewTagCallback: (tagLabel: string) => Promise<TagDto>
): void => {
  const tagFieldWatcher = useWatch(tagFieldName, formInstance);

  const handleJustCreatedTag = async (selectedTags?: (number | string)[]): Promise<void> => {
    if (!selectedTags?.length) return;

    const newTagLabel = selectedTags.filter((tag) => typeof tag === 'string')[0] as string;

    if (!newTagLabel) return;

    const createdTag = await createNewTagCallback(newTagLabel);

    const selectedTagIds = selectedTags.map((tag) => {
      if (typeof tag === 'string' && tag === createdTag.label) {
        return createdTag.id;
      }

      return tag;
    });

    formInstance.setFieldValue(tagFieldName, selectedTagIds);
  };

  useEffect(() => {
    const selectedTags = formInstance.getFieldValue(tagFieldName) as (number | string)[];
    handleJustCreatedTag(selectedTags);
  }, [tagFieldWatcher]);
};

export default useNewTagFormWatcher;
