import Head from "next/head";
import AuthLayout from "@/components/layouts/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { LoaderCircle, PlusIcon, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { generateRandomColor } from "@/lib/utils";
import { api } from "@/services/api";
import {
  addCategory,
  removeCategory,
  removeSubcategory,
  addSubcategory,
  updateSubcategory,
  updateCategory,
} from "@/store/slices/categorySlice";
import { Category, Subcategory } from "@/types/api";
import { toast } from "sonner";
import ColorPicker from "@/components/app-component/color-picker";

type Props = {};

const SpendCategory = (props: Props) => {
  const dispatch = useDispatch();

  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string[] | undefined>(
    categories.map((category) => category._id)
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setOpenAccordion(categories.map((category) => category._id));
  }, [categories]);

  const handleSelectChange = (cid: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleDeleteCategory = () => {
    setIsDeleting(true);
    api.categories
      .deleteCategory(selectedCategories)
      .then((res) => {
        if (!res.error) {
          setSelectedCategories([]);
          dispatch(removeCategory(selectedCategories));
          toast.success("Category deleted successfully", {
            duration: 4000,
            position: "top-center",
            classNames: {
              success: "!bg-green-600",
            },
          });
        }
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <>
      <Head>
        <title>Spend Category | Expense</title>
      </Head>
      <AuthLayout>
        <div className="py-4">
          <h2 className="text-xl font-semibold">Manage your Spend Category</h2>
          <p className="text-muted-foreground text-sm">
            Add or remove your categories.
          </p>

          <div className="flex justify-end gap-2">
            {selectedCategories.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="has-[>svg]:px-0 aspect-square py-0 h-6 rounded-sm text-xs text-destructive border-destructive/50 dark:border-destructive/50 bg-transparent shadow-none hover:text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/40"
                onClick={handleDeleteCategory}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              className="has-[>svg]:px-2 py-1 h-auto rounded-sm text-xs text-primary bg-transparent shadow-none hover:bg-primary/20"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <PlusIcon className="size-3" /> Add Category
            </Button>
          </div>
          {showAddForm && (
            <AddCategoryForm onCancel={() => setShowAddForm(false)} />
          )}

          <div className="flex flex-col mt-4 gap-4">
            <Accordion
              type="multiple"
              className="space-y-4"
              value={openAccordion}
              onValueChange={setOpenAccordion}
            >
              {categories.map((category) => {
                return (
                  <CategoryAccordion
                    category={category}
                    isSelected={selectedCategories.includes(category._id)}
                    isDeleting={
                      isDeleting && selectedCategories.includes(category._id)
                    }
                    onSelectChange={handleSelectChange}
                  />
                );
              })}
            </Accordion>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

const CategoryAccordion = ({
  isSelected,
  isDeleting,
  category,
  onSelectChange,
}: {
  isSelected?: boolean;
  isDeleting?: boolean;
  category: Category;
  onSelectChange?: (id: string) => void;
}) => {
  const dispatch = useDispatch();

  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const [isDeletingSubCategory, setIsDeletingSubCategory] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );

  const handleSelectSubCategoryChange = (sid: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid]
    );
  };

  const handleDeleteSubCategory = () => {
    setIsDeletingSubCategory(true);

    api.categories
      .deleteSubcategory(selectedSubCategories)
      .then((res) => {
        if (!res.error) {
          dispatch(removeSubcategory(selectedSubCategories));
          setSelectedSubCategories([]);
          toast.success("Spend Type deleted successfully", {
            duration: 4000,
            position: "top-center",
            classNames: {
              success: "!bg-green-600",
            },
          });
        }
      })
      .finally(() => {
        setIsDeletingSubCategory(false);
      });
  };

  return (
    <AccordionItem
      value={category._id}
      key={category._id}
      className="border last:border-b rounded-lg bg-card relative"
    >
      <AccordionTrigger className="hover:no-underline py-2 px-4">
        <div className="flex-1 flex items-center justify-between gap-2">
          <div className="flex-1 text-sm font-medium flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => {
                onSelectChange?.(category._id);
              }}
              onClick={(e) => e.stopPropagation()}
              disabled={isDeleting}
            />
            <ClickToEdit
              value={category.category_name}
              onEdit={(value) => {
                api.categories
                  .updateCategory(category._id, { name: value })
                  .then((res) => {
                    if (res.data) {
                      dispatch(
                        updateCategory({
                          ...category,
                          category_name: value,
                        })
                      );
                      return true;
                    }
                    return false;
                  })
                  .catch((err) => {
                    console.log(err);
                    return false;
                  });
                return true;
              }}
            />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-8 py-2 space-y-2 border-t">
          <div className="flex justify-end gap-2">
            {selectedSubCategories.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="has-[>svg]:px-0 aspect-square py-0 h-6 rounded-sm text-xs text-destructive border-destructive/50 dark:border-destructive/50 bg-transparent shadow-none hover:text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/40"
                onClick={handleDeleteSubCategory}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
            <Button
              type="button"
              className="has-[>svg]:px-2 py-1 h-auto rounded-sm text-xs text-primary bg-transparent shadow-none hover:bg-primary/20"
              onClick={() => setShowSubCategoryForm(!showSubCategoryForm)}
            >
              <PlusIcon className="size-3" /> Add
            </Button>
          </div>
          {showSubCategoryForm && (
            <AddSubCategoryForm
              sub_categories={category.subcategories || []}
              category_id={category._id}
              onCancel={() => setShowSubCategoryForm(false)}
            />
          )}
          <ul className="space-y-1">
            {category.subcategories?.map((sub) => (
              <li key={sub._id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedSubCategories.includes(sub._id)}
                  onCheckedChange={() => {
                    handleSelectSubCategoryChange(sub._id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isDeletingSubCategory}
                />{" "}
                <div className="flex-1 flex items-center ml-2">
                  <ColorPicker
                    color={sub.color}
                    onChange={(color) => {
                      api.categories
                        .updateSubcategory(sub._id, { color })
                        .then((resp) => {
                          console.log(color);
                          if (!resp.error) {
                            dispatch(
                              updateSubcategory({
                                cat_id: category._id,
                                sub_cat: {
                                  ...sub,
                                  color,
                                },
                              })
                            );
                            toast.success("Color updated successfully", {
                              duration: 4000,
                              position: "top-center",
                              classNames: {
                                success: "!text-green-600",
                              },
                            });
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  />
                  <ClickToEdit
                    value={sub.name}
                    onEdit={(value) => {
                      if (value.trim() === "" || value === sub.name) {
                        return true;
                      }
                      api.categories
                        .updateSubcategory(sub._id, { name: value })
                        .then((resp) => {
                          if (!resp.error) {
                            dispatch(
                              updateSubcategory({
                                cat_id: category._id,
                                sub_cat: {
                                  ...sub,
                                  name: value,
                                },
                              })
                            );
                            return true;
                          }
                          return false;
                        })
                        .catch((err) => {
                          console.log(err);
                          return false;
                        });
                      return false;
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </AccordionContent>
      {isDeleting ? (
        <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/5 dark:bg-black/50 z-10 flex items-center justify-center">
          <LoaderCircle className="size-8 text-destructive animate-spin" />
        </div>
      ) : null}
    </AccordionItem>
  );
};

const AddCategoryForm = ({ onCancel }: { onCancel?: () => void }) => {
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([""]);
  const [touched, setTouched] = useState({
    category: false,
    subcategories: [false],
  });
  const [isCategoryCreating, setIsCategoryCreating] = useState(false);

  // Check if all subcategories are filled and not empty
  const allSubcategoriesFilled = subcategories.every(
    (sub) => sub.trim() !== ""
  );

  // Check if form is valid
  const isFormValid = newCategory.trim() !== "" && allSubcategoriesFilled;

  // Show error for category if touched and empty
  const showCategoryError = touched.category && newCategory.trim() === "";

  // Show error for each subcategory if touched and empty
  const showSubcategoryError = (index: number) =>
    touched.subcategories[index] && subcategories[index].trim() === "";

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, ""]);
    // Add a new touched state for the new subcategory
    setTouched((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, false],
    }));
  };

  const handleSubcategoryChange = (index: number, value: string) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);

    // Mark as touched when user types
    if (!touched.subcategories[index]) {
      const newTouched = [...touched.subcategories];
      newTouched[index] = true;
      setTouched((prev) => ({
        ...prev,
        subcategories: newTouched,
      }));
    }
  };

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      const newSubcategories = subcategories.filter((_, i) => i !== index);
      const newTouched = touched.subcategories.filter((_, i) => i !== index);
      setSubcategories(newSubcategories);
      setTouched((prev) => ({
        ...prev,
        subcategories: newTouched,
      }));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const categoryData = {
        name: newCategory.trim(),
        color: generateRandomColor(),
        subcategories: subcategories.map((sub) => ({
          name: sub.trim(),
          color: generateRandomColor(),
        })),
      };
      // TODO: Add category to the store with subcategories
      setIsCategoryCreating(true);
      setTouched({
        category: false,
        subcategories: [false],
      });
      api.categories
        .createCategory(categoryData)
        .then((resp) => {
          if (!resp.error) {
            dispatch(addCategory(resp.data?.data as Category));
            resetData();
            onCancel?.();
            toast.success("Category created successfully", {
              duration: 4000,
              position: "top-center",
              classNames: {
                success: "!bg-green-600",
              },
            });
          }
        })
        .finally(() => {
          setIsCategoryCreating(false);
        });
    } else {
      // Mark all fields as touched to show validation errors
      setTouched({
        category: true,
        subcategories: subcategories.map(() => true),
      });
    }
  };

  const resetData = () => {
    setNewCategory("");
    setSubcategories([""]);
    setTouched({
      category: false,
      subcategories: [false],
    });
  };

  return (
    <form
      onSubmit={handleAddCategory}
      className="mt-4 p-4 border rounded-lg bg-muted/10 relative"
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-full">
            <Input
              type="text"
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setTouched((prev) => ({ ...prev, category: true }));
              }}
              onBlur={(e) => {
                if (e.target.value.trim() === "") {
                  setTouched((prev) => ({ ...prev, category: true }));
                } else {
                  setTouched((prev) => ({ ...prev, category: false }));
                }
              }}
              className={`h-9 ${showCategoryError ? "border-destructive" : ""}`}
              required
              maxLength={30}
              autoFocus
            />
            {showCategoryError && (
              <p className="text-xs text-destructive mt-1">
                Category name is required
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 px-4 py-2">
          <label className="block text-xs font-medium ">Spend Type</label>
          {subcategories.map((sub, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={`Spend Type ${index + 1}`}
                    value={sub}
                    onChange={(e) =>
                      handleSubcategoryChange(index, e.target.value)
                    }
                    className={`h-8 !text-xs ${
                      showSubcategoryError(index) ? "border-destructive" : ""
                    }`}
                    onBlur={(e) => {
                      const newTouched = [...touched.subcategories];
                      if (e.target.value.trim() === "") {
                        newTouched[index] = true;
                      } else {
                        newTouched[index] = false;
                      }
                      setTouched((prev) => ({
                        ...prev,
                        subcategories: newTouched,
                      }));
                    }}
                    autoFocus={subcategories.length > 1}
                  />
                  {subcategories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeSubcategory(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {showSubcategoryError(index) && (
                  <p className="text-xs text-destructive mt-2 px-1">
                    Spend type is required
                  </p>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            className="has-[>svg]:px-2 mt-1 py-1 h-auto rounded-sm text-xs text-primary bg-transparent shadow-none hover:bg-primary/20"
            onClick={handleAddSubcategory}
          >
            <PlusIcon className="h-3 w-3" /> Add More
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              onCancel?.();
              resetData();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isFormValid}
            className={`text-xs ${
              !isFormValid ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Save
          </Button>
        </div>
      </div>
      {isCategoryCreating && (
        <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/5 dark:bg-black/50 z-10 flex items-center justify-center">
          <LoaderCircle className="size-8 text-primary animate-spin" />
        </div>
      )}
    </form>
  );
};

const AddSubCategoryForm = ({
  sub_categories,
  category_id,
  onCancel,
}: {
  sub_categories: Subcategory[];
  category_id: string;
  onCancel?: () => void;
}) => {
  const dispatch = useDispatch();

  const [subcategories, setSubcategories] = useState<string[]>([""]);
  const [touched, setTouched] = useState<boolean[]>([]);
  const [isSubCategoryCreating, setIsSubCategoryCreating] = useState(false);

  // Check if form is valid
  const isFormValid = subcategories.every((sub) => sub.trim() !== "");

  // Show error for each subcategory if touched and empty
  const showSubcategoryError = (index: number) =>
    touched[index] && subcategories[index].trim() === "";

  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, ""]);
    // Add a new touched state for the new subcategory
    setTouched((prev) => [...prev, false]);
  };

  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubCategoryCreating(true);
    api.categories
      .createSubcategory({
        category_id,
        subcategories: subcategories.map((sub) => ({
          name: sub,
          color: generateRandomColor(),
        })),
      })
      .then((resp) => {
        if (!resp.error) {
          dispatch(
            addSubcategory({
              cat_id: category_id,
              sub_cat: [...sub_categories, ...resp.data?.data.created],
            })
          );
          onCancel?.();
          resetData();
          toast.success("Spend Type created successfully", {
            duration: 4000,
            position: "top-center",
            classNames: {
              success: "!bg-green-600",
            },
          });
        }
      })
      .finally(() => {
        setIsSubCategoryCreating(false);
      });
  };

  const handleSubcategoryChange = (index: number, value: string) => {
    const newSubcategories = [...subcategories];
    newSubcategories[index] = value;
    setSubcategories(newSubcategories);

    // Mark as touched when user types
    if (!touched[index]) {
      const newTouched: boolean[] = [...touched];
      newTouched[index] = true;
      setTouched((prev) => newTouched);
    }
  };

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      const newSubcategories = subcategories.filter((_, i) => i !== index);
      const newTouched = touched.filter((_, i) => i !== index);
      setSubcategories(newSubcategories);
      setTouched(newTouched);
    }
  };

  const resetData = () => {
    setSubcategories([""]);
    setTouched([false]);
  };

  return (
    <form
      onSubmit={handleAddSubCategory}
      className="p-4 border rounded-lg bg-muted/10 relative"
    >
      <div className="space-y-2">
        {subcategories.map((sub, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`Spend ${index + 1}`}
                  value={sub}
                  onChange={(e) =>
                    handleSubcategoryChange(index, e.target.value)
                  }
                  className={`h-8 !text-xs ${
                    showSubcategoryError(index) ? "border-destructive" : ""
                  }`}
                  onBlur={(e) => {
                    const newTouched = [...touched];
                    if (e.target.value.trim() === "") {
                      newTouched[index] = true;
                    } else {
                      newTouched[index] = false;
                    }
                    setTouched((prev) => newTouched);
                  }}
                  autoFocus
                />
                {subcategories.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeSubcategory(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {showSubcategoryError(index) && (
                <p className="text-xs text-destructive mt-2 px-1">
                  Spend type is required
                </p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          size="sm"
          className="has-[>svg]:px-2 mt-1 py-1 h-auto rounded-sm text-xs text-primary bg-transparent hover:bg-primary/20"
          onClick={handleAddSubcategory}
        >
          <PlusIcon className="h-3 w-3" /> Add More
        </Button>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              onCancel?.();
              resetData();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isFormValid}
            className={`text-xs ${
              !isFormValid ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Save
          </Button>
        </div>
      </div>
      {isSubCategoryCreating && (
        <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-black/5 dark:bg-black/50 z-10 flex items-center justify-center">
          <LoaderCircle className="size-8 text-primary animate-spin" />
        </div>
      )}
    </form>
  );
};

const ClickToEdit = ({
  value,
  onEdit,
}: {
  value: string;
  onEdit: (value: string) => boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = async () => {
    setIsSaving(true);
    const result = await onEdit(inputValue);
    if (result) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  return isEditing ? (
    <Input
      className="px-2 py-1 h-auto border-0 !ring-0 bg-input/20 !shadow-none w-full"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      autoFocus
      onBlur={handleBlur}
      disabled={isSaving}
      maxLength={30}
    />
  ) : (
    <p onClick={handleEdit} className="cursor-text py-1 px-2 truncate">
      {value}
    </p>
  );
};

export default SpendCategory;
