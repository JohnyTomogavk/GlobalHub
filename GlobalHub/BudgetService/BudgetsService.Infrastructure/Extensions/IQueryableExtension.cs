using Microsoft.EntityFrameworkCore;

namespace BudgetsService.Infrastructure.Extensions;

public static class IQueryableExtension
{
    public static IQueryable<T> ApplySort<T>(this IQueryable<T> entities, string orderByColumn,
        bool sortByAscending)
    {
        if (string.IsNullOrEmpty(orderByColumn))
        {
            return entities;
        }

        return sortByAscending
            ? entities.OrderBy(item => EF.Property<string>(item, orderByColumn))
            : entities.OrderByDescending(item => EF.Property<string>(item, orderByColumn));
    }

    public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> entities, int itemsCountPerPage,
        int pageNumber)
    {
        return entities.Skip(pageNumber * itemsCountPerPage).Take(itemsCountPerPage);
    }
}
