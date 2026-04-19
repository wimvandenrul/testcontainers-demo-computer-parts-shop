using Application.Interfaces;

namespace Application.Interfaces;

public interface ICategoryRepository
{
    Task<IReadOnlyList<Domain.Entities.Category>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Domain.Entities.Category?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
}
