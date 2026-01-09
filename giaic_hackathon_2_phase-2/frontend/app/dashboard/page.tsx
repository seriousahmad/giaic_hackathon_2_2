'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/lib/api';
import { Task, TaskFilter, TaskSort } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { SearchInput } from '@/components/ui/search-input';
import TodoList from '@/components/todo/todo-list';
import AddTodoModal from '@/components/todo/add-todo-modal';
import FilterControls from '@/components/todo/filter-controls';
import SortControls from '@/components/todo/sort-controls';
import EmptyState from '@/components/todo/empty-state';

export default function DashboardPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ field: 'createdAt', direction: 'desc' });

  // Combine all filters and search into a single API call
  const {
    data: todos,
    loading,
    error,
    refetch
  } = useApi<Task[]>(() => apiService.tasks.getAll(), [searchQuery, filters, sort]);

  // Effect to mark all tasks as incomplete when the page loads
  useEffect(() => {
    if (todos && todos.length > 0) {
      const completedTodos = todos.filter(todo => todo.completed);
      if (completedTodos.length > 0) {
        completedTodos.forEach(todo => {
          // Mark each completed task as incomplete
          apiService.tasks.toggleComplete(todo.id, false);
        });
        // Refresh the list after updating
        setTimeout(() => refetch(), 100); // Small delay to allow updates to process
      }
    }
  }, [todos, refetch]);

  const handleAddTodo = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    refetch(); // Refresh the todo list after adding a new todo
  };

  // Filter and sort todos on the client side based on search, filters, and sort
  const filteredAndSortedTodos = todos?.filter(todo => {
    // Apply search filter
    if (searchQuery &&
        !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!todo.description || !todo.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!todo.tags || !todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))) {
      return false;
    }

    // Apply status filter
    if (filters.completed !== undefined && todo.completed !== filters.completed) {
      return false;
    }

    // Apply priority filter
    if (filters.priority && todo.priority !== filters.priority) {
      return false;
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      if (!todo.tags || !filters.tags.some(filterTag =>
        todo.tags?.some(todoTag => todoTag.toLowerCase() === filterTag.toLowerCase())
      )) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sort by field
    let aValue: any, bValue: any;

    switch (sort.field) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'priority':
        // Prioritize HIGH > MEDIUM > LOW
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_VALUE;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_VALUE;
        break;
      case 'createdAt':
      case 'updatedAt':
        aValue = new Date(a[sort.field]).getTime();
        bValue = new Date(b[sort.field]).getTime();
        break;
      default:
        aValue = a[sort.field];
        bValue = b[sort.field];
    }

    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" label="Loading your todos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6">
          <CardBody>
            <p className="text-red-600 text-center">Error loading todos: {error}</p>
            <Button
              onClick={refetch}
              className="mt-4 w-full"
            >
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
              <Button onClick={handleAddTodo}>
                Add Todo
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-3">
                <SearchInput
                  placeholder="Search todos..."
                  onSearch={setSearchQuery}
                />
              </div>
              <div className="flex justify-end">
                <SortControls
                  currentSort={sort}
                  onSortChange={setSort}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                  <FilterControls
                    currentFilters={filters}
                    onFilterChange={setFilters}
                  />
                </div>
              </div>

              <div className="lg:col-span-3">
                {filteredAndSortedTodos.length > 0 ? (
                  <TodoList todos={filteredAndSortedTodos} onRefresh={refetch} />
                ) : (
                  <EmptyState
                    title={
                      searchQuery || Object.keys(filters).some(key => filters[key as keyof TaskFilter])
                        ? 'No todos found'
                        : 'No todos yet'
                    }
                    description={
                      searchQuery || Object.keys(filters).some(key => filters[key as keyof TaskFilter])
                        ? 'Try adjusting your search or filters'
                        : 'Get started by adding your first todo'
                    }
                    showAction={!searchQuery && !Object.keys(filters).some(key => filters[key as keyof TaskFilter])}
                    actionText="Add Your First Todo"
                    onAction={handleAddTodo}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTodoModal
          onClose={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}
    </div>
  );
}