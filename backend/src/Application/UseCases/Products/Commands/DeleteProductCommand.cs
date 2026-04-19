using Application.Interfaces;

namespace Application.UseCases.Products.Commands;

public class DeleteProductCommand
{
    private readonly IProductRepository _repository;

    public DeleteProductCommand(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> ExecuteAsync(int id, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing == null)
            return false;

        await _repository.DeleteAsync(id, cancellationToken);
        return true;
    }
}
