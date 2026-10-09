USE CookFlow;
GO

CREATE OR ALTER PROCEDURE SP_GetItemsLista @LCid INT, @USid INT AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.INid, i.INnombre,
           li.LCIcantidad AS LCcantidad,
           li.LCIunidad   AS LCunidad
    FROM LISTA_COMPRA_ITEMS li
    JOIN INGREDIENTES i ON i.INid = li.INid
    JOIN LISTA_COMPRA l ON l.LCid = li.LCid
    WHERE li.LCid = @LCid AND l.USid = @USid
    ORDER BY i.INnombre;
END
GO

CREATE OR ALTER PROCEDURE SP_UpsertItemLista
    @LCid INT, @USid INT, @INid INT, @cantidad DECIMAL(10,2), @unidad VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM LISTA_COMPRA WHERE LCid = @LCid AND USid = @USid)
    BEGIN SELECT 0 AS ok; RETURN; END

    IF EXISTS (SELECT 1 FROM LISTA_COMPRA_ITEMS WHERE LCid = @LCid AND INid = @INid)
        UPDATE LISTA_COMPRA_ITEMS SET LCIcantidad = ISNULL(LCIcantidad,0) + @cantidad
        WHERE LCid = @LCid AND INid = @INid;
    ELSE
        INSERT INTO LISTA_COMPRA_ITEMS (LCid, INid, LCIcantidad, LCIunidad)
        VALUES (@LCid, @INid, @cantidad, @unidad);
    SELECT 1 AS ok;
END
GO

CREATE OR ALTER PROCEDURE SP_UpdateItemLista
    @LCid INT, @USid INT, @INid INT, @cantidad DECIMAL(10,2), @unidad VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE li SET LCIcantidad = @cantidad, LCIunidad = @unidad
    FROM LISTA_COMPRA_ITEMS li JOIN LISTA_COMPRA l ON l.LCid = li.LCid
    WHERE li.LCid = @LCid AND li.INid = @INid AND l.USid = @USid;
    SELECT @@ROWCOUNT AS filas;
END
GO

CREATE OR ALTER PROCEDURE SP_AddRecetaALista @LCid INT, @USid INT, @RECid INT AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @pax INT = (SELECT LCpax FROM LISTA_COMPRA WHERE LCid = @LCid AND USid = @USid);
    IF @pax IS NULL BEGIN SELECT 0 AS ok; RETURN; END
    IF NOT EXISTS (SELECT 1 FROM RECETAS WHERE RECid = @RECid) BEGIN SELECT -1 AS ok; RETURN; END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Suma a los que ya estaban
        UPDATE li SET LCIcantidad = ISNULL(li.LCIcantidad,0) + ISNULL(ri.RIcantidad,0) * @pax
        FROM LISTA_COMPRA_ITEMS li
        JOIN RECETA_INGREDIENTES ri ON ri.INid = li.INid AND ri.RECid = @RECid
        WHERE li.LCid = @LCid;

        -- Inserta los que no estaban
        INSERT INTO LISTA_COMPRA_ITEMS (LCid, INid, LCIcantidad, LCIunidad)
        SELECT @LCid, ri.INid, ri.RIcantidad * @pax, ri.RIunidad
        FROM RECETA_INGREDIENTES ri
        WHERE ri.RECid = @RECid
          AND NOT EXISTS (SELECT 1 FROM LISTA_COMPRA_ITEMS li WHERE li.LCid = @LCid AND li.INid = ri.INid);

        COMMIT TRANSACTION;
        SELECT 1 AS ok;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

SELECT name FROM sys.procedures WHERE name LIKE '%Lista%' ORDER BY name;